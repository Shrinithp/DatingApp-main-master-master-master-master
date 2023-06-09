import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = "http://localhost:5001/hubs/";
  private hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
 //create a new observable. we want our component to subscribe to this information so that they get notified.
 onlineUsers$ = this.onlineUsersSource.asObservable();
 


  constructor() {}

  // building hub connection
  createHubConnection(user: User){// create this inside accountservice(setCurrentuser)
      this.hubConnection = new HubConnectionBuilder()
      //in program.cs
      .withUrl(this.hubUrl + 'presence',{
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error=>console.log(error));


      //to listen connection from server

      //name should be as that in presenceHub(server)
      this.hubConnection.on('UserIsOnLine', username =>{
        alert(username +" is active");
      })
      this.hubConnection.on('UserIsOffline', username =>{
        alert(username+ " went offline");
      })
      this.hubConnection.on('GetOnlineUsers', usernames =>{// obervables is created above
        this.onlineUsersSource.next(usernames);
      })

      
        }

        stopHubConnection(){
          this.hubConnection?.stop().catch(error => console.log(error));// stop inside account service(logout method)
        }
}
