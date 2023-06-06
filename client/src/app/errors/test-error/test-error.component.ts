import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent implements OnInit {

  baseUrl = "https://localhost:5000/api/";
  validationErrors: string[] = [];




  constructor(private http:HttpClient) {
    
  }
  // defines the initialization logic for the component
  ngOnInit(): void{

  }

  get404Error(){
    // this.http.get(this.baseUrl+'buggy/not-found') this will return an observable so we need to Subscribe
    this.http.get(this.baseUrl+'buggy/not-found').subscribe({
      next:response =>console.log(response),
      error:error =>console.log(error)
    })
  }


  get400Error(){
    // this.http.get(this.baseUrl+'buggy/not-found') this will return an observable so we need to Subscribe
    this.http.get(this.baseUrl+'buggy/bad-request').subscribe({
      next:response =>console.log(response),
      error:error =>console.log(error)
    })
  }


  get500Error(){
    // this.http.get(this.baseUrl+'buggy/not-found') this will return an observable so we need to Subscribe
    this.http.get(this.baseUrl+'buggy/server-error').subscribe({
      next:response =>console.log(response),
      error:error =>console.log(error)
    })
  }

  get401Error(){
    // this.http.get(this.baseUrl+'buggy/not-found') this will return an observable so we need to Subscribe
    this.http.get(this.baseUrl+'buggy/auth').subscribe({
      next:response =>console.log(response),
      error:error =>console.log(error)
    })
  }


  get400ValidationError(){
    // By using http.post() the code is indicating that it wants to send data in the request body for creating a new registration. 
    this.http.post(this.baseUrl+'account/register', {}).subscribe({
      next:response =>console.log(response),
      error:error =>{
        console.log(error);
        this.validationErrors=error;
      }
    })
  }
}
