import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit{
  //passing to child component
  //member passed as an input property comes a little later so we can
  //give it as undefined.
  @Input() member: Member | undefined;

  
  constructor(private memberService: MembersService){}

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next:() => alert('you have liked ' + member.knownAs)
    })
  }
  

}