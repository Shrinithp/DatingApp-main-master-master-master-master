import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  //checks if registration mode is active or not.
  registerMode = false;
  users: any;

//since we put here getusers we have to iject that inside the constructor.
  constructor() {

    
  }

  ngOnInit(): void {
    
  }

  registerToggle(){
    //this line will toggle between true and false
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
