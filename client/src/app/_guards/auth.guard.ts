import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  //we have created a constructor because we need to inject our account service into this guard
  constructor(private accountService: AccountService){}
  //whenever we create observable we need to subscibe. but auth guard it will subscribe automatically


  canActivate(): Observable<boolean>{
    return this.accountService.currentUser$.pipe(
      map(user => {
        if (user) return true;
        else{
          alert('you shall not pass');
          return false
        }
      })
    )
  }
  
}
