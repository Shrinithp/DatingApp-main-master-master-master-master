import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  //memberTabs is inside html
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  //create an objcet we get member using route 
  //we have removed ngIf members inside html
  member: Member={ } as Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  activeTab: TabDirective | undefined;
  messages: Message[]=[];


  //I want ot get member from API so i have created a constructor
  
  constructor(private memberService: MembersService,
     private route: ActivatedRoute, private messageService: MessageService) {}

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

  loadMember() {
    //the router is not knowing if username is an actual route parameter.
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return ;
    this.memberService.getMember(username).subscribe({
      next: member=> {
        this.member = member;
        //if i put this.getimages() in ngoninit
        //before fetching members it will execuite getimages
        //hence we put getimages here.
        this.galleryImages = this.getImages();
      }
    })
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
    if(this.activeTab.heading==='Messages'){
        this.loadMessages();
    }
  }

 
}
