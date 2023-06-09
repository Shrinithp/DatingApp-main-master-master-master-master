import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  //memberTabs is inside html
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  //create an objcet we get member using route 
  //we have removed ngIf members inside html
  member: Member={ } as Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective | undefined;
  messages: Message[]=[];
  user?:User;


  //I want ot get member from API so i have created a constructor
  
  constructor(private accountService: AccountService,
     private route: ActivatedRoute,
      private messageService: MessageService, 
      public presenceService: PresenceService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
          next: user =>{
            if(user) this.user = user;
          }
        })
      }
  


  ngOnInit(): void{

    //we are no using loadmembers() here
    //because we need access to membertab but we dont 
    //have accesss until member is loaded
    //so we are using root resolver to get members. (queryparams)
this.route.data.subscribe({
  next: data=>this.member=data['member']
})

    this.route.queryParams.subscribe({
      next: params=>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
    

    this.galleryOptions= [
      {width:"500px",
      height: "500px",
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview: false
    }
    ]

    this.galleryImages = this.getImages();

  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  getImages(){
  if(!this.member) return [];
    const imageUrls=[];
    for(const photo of this.member.photos){
      imageUrls.push({
        small:photo.url,
        medium:photo.url,
        big:photo.url
      })
    }
    return imageUrls;
  }

//meaages in user last active section
selectTab(heading: string){
if(this.memberTabs){
  this.memberTabs.tabs.find(x=>x.heading === heading)!.active =true;
}
}


  loadMessages(){
    if(this.member){
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

//load messages only when we click on message tabs
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if(this.activeTab.heading==='Messages' && this.user){
        this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

 
}
