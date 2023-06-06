import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/members.service';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit{
  //members is inside accountnservices
  member: Member|undefined;
  user: User |null=null;

  //after updating i want to reset page thats why im using this
  @ViewChild('editForm') editForm: NgForm | undefined;

  //if user want to change the browser all his changes will be lost
  //inorder to alert user we are using this
  //browser will send notification
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event:any) {
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }

  
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>this.user=user
    })

    
  }

  ngOnInit(){
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return;
     this.memberService.getMember(this.user.username).subscribe({
    next:member=>this.member=member
  })
}

updateMember(){
  this.memberService.updateMember(this.editForm?.value).subscribe({
    next: _=>  
    //after upadate reset the page so we are using reset.
    this.editForm?.reset(this.member)
  
  })
 
}
}
