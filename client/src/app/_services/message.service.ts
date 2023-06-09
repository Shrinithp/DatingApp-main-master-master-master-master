import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelpers';
import { Message } from '../_models/message';
import { Member } from '../_models/member';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = "http://localhost:5001/api/";
  hubUrl = "http://localhost:5001/hubs/";
  private hubConnection? : HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();


  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUserName: string) {
      this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' +otherUserName, {
        //we need to authenticate so we use this accesstokenFactory
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

      this.hubConnection.start().catch(error=>console.log(error));
      this.hubConnection.on('ReceiveMessageThread', messages =>{
          this.messageThreadSource.next(messages);
      })

      this.hubConnection.on('NewMessage', message=>{
        this.messageThread$.pipe(take(1)).subscribe({
          next: messages=>{
            //add on new message coming from signalr to messages 
            this.messageThreadSource.next([...messages, message])
          }
          
        })
      })
    } 

    stopHubConnection( ) {
      if(this.hubConnection)
      {this.hubConnection.stop();
      }
    
    }
      
    


getMessages(pageNumber: number, pageSize: number, container: string){

  let params = getPaginationHeaders(pageNumber, pageSize);
  params = params.append('Container', container);
  //messages is the controller
  return getPaginatedResult<Message[]>(this.baseUrl+'messages' ,params, this.http);

}

getMessageThread(username: string) {
  return this.http.get<Message[]>(this.baseUrl+'messages/thread/' + username);
}

//return a promise so we use async

async sendMessage(username: string, content: string){
  //same should be there in creatememberdto in API.
  //json is in camelcase so it will understand in Recepientusername in API

  //sendmessage should be same as that in messagehub
return this.hubConnection?.invoke('SendMessage', {recipientUsername:username, content})
.catch(error=>console.log(error));
}

deleteMessage(id: number){
  return this.http.delete(this.baseUrl + 'messages/' +id);
}
 
}






