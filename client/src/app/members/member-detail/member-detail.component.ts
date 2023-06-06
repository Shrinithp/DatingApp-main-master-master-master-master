import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];


  //I want ot get member from API so i have created a constructor
  
  constructor(private memberService: MembersService, private route: ActivatedRoute) {}

  ngOnInit(): void{
    this.loadMember();
    

    this.galleryOptions= [
      {width:"500px",
      height: "500px",
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview: false
    }
    ]

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

}
