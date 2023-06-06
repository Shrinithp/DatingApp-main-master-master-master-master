import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //we donot need to physicaaly unsubscribe using this take(1).
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user){
          request =request.clone({
            setHeaders:{
              //note its a backtick
              //$ alternative way of using concat.
              Authorization:`Bearer ${user.token}`
            }
          })
        }
      }
    })
    return next.handle(request);
  }
}
