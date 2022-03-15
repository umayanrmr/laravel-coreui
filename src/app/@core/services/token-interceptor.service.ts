import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, filter, retryWhen, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Token } from '../bases/auth-service.base';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private refresh_token_in_progress = false;
  private refresh_token_subject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(public _auth_service: AuthService,
    private _router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const retryLimit = environment.production ? 10 : 3;
    let attempt = 0;
    return next.handle(this.authentication_token(request))
      .pipe(
        retryWhen(errors => errors.pipe(
          concatMap(index => {
            let newtime = attempt * 1000;
            return of(index).pipe(delay(newtime))
          }),
          tap(error => {
            const skip_error_status = [401, 422, 409, 400]
            if (++attempt > retryLimit || skip_error_status.includes(+error.status)) {
              throw error;
            }
          })
        )),
        catchError(error => {
          if (request.url.includes('refresh') || request.url.includes('login') || request.url.includes('logout')) {
            this._auth_service.purge_cached_user_info();
            return throwError(error);
          }

          if (+error.status !== 401) {
            return throwError(error);
          }

          if (this.refresh_token_in_progress) {
            return this.refresh_token_subject
              .pipe(
                filter(result => result !== null),
                take(1),
                switchMap(() => next.handle(this.authentication_token(request))
                )
              )
          } else {
            this.refresh_token_in_progress = true;
            this.refresh_token_subject.next(null);
            return this._auth_service
              .refresh_token()
              .pipe(
                take(1),
                switchMap((token: Token) => {
                  this.refresh_token_in_progress = false;
                  this.refresh_token_subject.next(token);
                  return next.handle(this.authentication_token(request));
                }),
                catchError((err: any) => {
                  this.refresh_token_in_progress = false;
                  this._auth_service.purge_cached_user_info();
                  this._router.navigate(['/auth']);
                  return throwError(error);
                })
              )
          }
        }
        )
      );
  }


  authentication_token(request) {
    // use this if the api has different port than 80
    // const url = (request.url as string).startsWith('http') ? request.url : `${environment.api}${request.url}`
    // const q = request.clone({ url: url });
    const q = request.clone();

    if (!this._auth_service.token) {
      return q;
    }

    return q.clone({
      setHeaders: {
        Authorization: `Bearer ${this._auth_service.token}`
      }
    });
  }
}
