import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

//takes input inside the form and prints in the console.
export class NavComponent implements OnInit{
  model: any = {};
 



  constructor(public accountService: AccountService, private router:Router) {
    
  }
  ngOnInit(): void{
    

  }

  // getCurrentUser(){
  //   this.accountService.currentUser$.subscribe({
  //     next: user =>this.loggedIn =!!user,
  //     error: error =>console.log(error)
  //   })
  // }

  login(){
    //subscribe says what to do next
    this.accountService.login(this.model).subscribe({
      //we donot need any response so we are using _
    next: _=> this.router.navigateByUrl('/members')
  })
  }
  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    // this.loggedIn=false;
    
  }
}
