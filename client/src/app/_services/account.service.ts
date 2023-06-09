import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, pipe } from 'rxjs';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  //i should use environment here but im using hard code
  baseUrl = "http://localhost:5001/api/";
  // baseUrl = environment.apiUrl;

  // BehaviorSubject is a type of observable in RxJS that stores the current value and 
  // emits it to subscribers when they subscribe to it.

  // The initial value of null is provided as the argument to the BehaviorSubject constructor,
  //  indicating that initially, there is no current user available.
  private currentUserSource = new BehaviorSubject<User| null>(null);
  // $ signifyies that its an observable.
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http:HttpClient, private presenceService: PresenceService){}


  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User)=>{
        const user = response;
        if(user){
         
          // this.currentUserSource.next(user) is used to emit a new value (user) to the currentUserSource Subject, 
          // allowing subscribers to be notified and take appropriate actions based on the emitted user data.
          this.setCurrentUser(user);
        }
      })
    )
  }
  //pipe which gives us access to rxjs operator so that we can transform or do something with these observables
  //before the component subscribes to it.
  register(model:any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
    map(user=>{
      if(user){
        this.setCurrentUser(user);
      }
      //if we want to see if the user has registered in console use the below commented code.
      //return user;
    })
    )
  }

  setCurrentUser(user:User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;// "role" is defined in our token we cannot change that

    //if role is array then first part of ternary operation. if not array second part.
    Array.isArray(roles) ? user.roles = roles: user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user))
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }


logout(){
  localStorage.removeItem('user');
  this.currentUserSource.next(null);
  this.presenceService.stopHubConnection();
}

getDecodedToken(token : string) {
  //1 indicate middle part of the token
  return JSON.parse(atob(token.split('.')[1]))
}
}