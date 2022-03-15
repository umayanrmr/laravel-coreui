import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { ConfigService } from "../services/config.service";
import jwt_decode from 'jwt-decode';


export class Login {
  public email: string;
  public password: string;
}

export class Token {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  roles: string[];
}

export class AuthServiceBase {
  protected _authentication_changed = new BehaviorSubject<boolean>(null);
  protected readonly token_key = 'token';
  protected readonly email_key = 'username';
  protected readonly roles_key = 'role';
  protected readonly sub_key = 'sub';

  
  constructor(protected _http: HttpClient,
    protected _config_service: ConfigService) { }

  public get userid() {
    return localStorage.getItem(this.sub_key);
  }

  public get username() {
    return localStorage.getItem(this.email_key);
  }

  public get roles() : string[]{
    return JSON.parse(localStorage.getItem(this.roles_key));
  }
  
  public get token() {
    return localStorage.getItem(this.token_key);
  }

  public get is_authenticated() {
    return this.token != null;
  }

  public login(user: Login) : Observable<boolean> {
    return this._http.post<Token>(`/api/auth/login`, user)
               .pipe(
                  tap(token => {   
                    this.store_email(user.email);
                    this.cache_user_info(token);
                  }),
                  switchMap(x => this._config_service.load_application_configuration()),
                  take(1),
                  catchError((error: HttpErrorResponse) =>  {
                    return throwError(error);
                  })
               )
  }
  

  public logout() : Observable<boolean>  {
    return this._http
               .post(`/api/auth/logout`,null)
               .pipe(
                 tap(x => this.purge_cached_user_info()),
                 take(1),
                 catchError((error: HttpErrorResponse) =>  {
                   return throwError(error);
                 }),
                 map(x => true)
                );
  }

  public refresh_token(): Observable<Token> {
    return this._http.post<Token>(`/api/auth/refresh`, null)
               .pipe(
                tap((token: Token)  => this.cache_user_info(token)));
  }


  public change_password(model) : Observable<boolean> {
    return this._http.patch(`/api/auth/password`, model)
      .pipe(map(x => {
        return true;
      })
    )
  }

  public me() : Observable<any>{
    const cache = localStorage.getItem('me');
    if(cache) return of(JSON.parse(cache));
    return this._http.post(`/api/auth/me`, null)
                .pipe(map(x => {
                  localStorage.setItem('me', JSON.stringify(x));
                  return x;
                }))
  }



  protected cache_user_info(token: Token) {
    this.store_role_and_sub(token);
    this.store_token(token);
  }


  protected store_role_and_sub(token: Token) {
    const payload = jwt_decode(token.access_token);
    localStorage.setItem(this.roles_key, JSON.stringify(payload['roles']));
    localStorage.setItem(this.sub_key, payload['sub']);
  }

  protected store_email(email: string) {
    localStorage.setItem(this.email_key, email);
  }

  protected store_token(token: Token) {
    localStorage.setItem(this.token_key, token.access_token);
    this._authentication_changed.next(true);
  }


  public purge_cached_user_info() {
    Object.keys(localStorage).forEach(function(key){
      if(!key.endsWith('cache')){
        localStorage.removeItem(key);
      }
    });
    this._authentication_changed.next(false);
  }
}
