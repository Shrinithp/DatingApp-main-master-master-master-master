import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
//these are decorators.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//just like we have dependency injection in dotnet file we also have in angular i.e, we have to inject http module.

//constructor is too early to fetch data from an api so lifecycle process is implemented(OnInit).
export class AppComponent implements OnInit {
//title can br written after constructor or before.
  title = 'DatingApp'; //title is of type string.


  constructor( private accountService: AccountService){}
  ngOnInit(): void {
    this.setCurrentUser();
    
  }


  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
    
  }



  

}
