import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {


  constructor(private accountService: AccountService) {
    
  }
  canActivate(): Observable<boolean>{
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(!user) return false;

        if(user.roles.includes('Admin') || user.roles.includes('Moderator')) {
          return true;
        } else{
          alert("you cannot enter here")
          return false;
        }
      })
    )
  }
  
}
