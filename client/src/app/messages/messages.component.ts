import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})



export class MessagesComponent implements OnInit{

  messages: Message[] | undefined;
  pagination: Pagination | undefined;
  container= 'Unread';
  pageNumber = 1;
  pageSize =5;
  loading = false;


  constructor(private messageService: MessageService) {

    
  }
  ngOnInit(): void {
   this.loadMessages();
  }

  loadMessages(){
    //  not to show messages when loading
    this.loading=true;

    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next: response=>{
        this.messages= response.result;
        this.pagination= response.pagination;
        this.loading=false;
      }
    })
  }

  pageChanged(event:any) {
    if(this.pageNumber!==event.page){
      this.pageNumber=event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id: number){
    this.messageService.deleteMessage(id).subscribe({
      //1 indicates delete one message from messages array.
      next:() => this.messages?.splice(this.messages.findIndex(m=>m.id===id), 1)
    })
  }

}
