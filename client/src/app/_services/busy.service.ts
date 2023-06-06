import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class BusyService {
  busyRequestCount = 0;
  
  constructor() { }

  busy() {
    
  }

  idle(){
    this.busyRequestCount--;
    if(this.busyRequestCount<=0){
      this.busyRequestCount=0;
      
    }
  }
}
