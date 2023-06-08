import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelpers';
import { Message } from '../_models/message';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = "http://localhost:5001/api/";

  constructor(private http: HttpClient) { 

    
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

sendMessage(username: string, content: string){
  //same should be there in creatememberdto in API.
  //json is in camelcase so it will understand in Recepientusername in API
return this.http.post<Message>(this.baseUrl+'messages',
 {recipientUsername: username, content})
}

deleteMessage(id: number){
  return this.http.delete(this.baseUrl + 'messages/' +id);
}
 
}






