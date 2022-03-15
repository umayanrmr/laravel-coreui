import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceBase } from '../bases/auth-service.base';
import { ConfigService } from './config.service';




@Injectable({
  providedIn: 'root'
})
export class AuthService extends AuthServiceBase {

  constructor(_http: HttpClient,
    _config_service: ConfigService) {
    super(_http, _config_service);
    
  }
}
