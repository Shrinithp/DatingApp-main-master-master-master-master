import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modal/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

users: User[]=[];
//modal file
bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();

constructor(private adminService: AdminService, private modalService: BsModalService) {

  
}



ngOnInit(): void {
  this.getUsersWithRoles() 
  }



getUsersWithRoles() {
  this.adminService.getUserWithRoles().subscribe({
    next: users=>this.users = users
  })
}

openRolesModal(){

  //ModalOptions is a bootstrap class
const initialState: ModalOptions={
  initialState: {
    list: [
      'hello',
      'this',
      'testing'
    ],
    title:'sample'
  }
}
  this.bsModalRef = this.modalService.show(RolesModalComponent,initialState);
  this.bsModalRef.content!.closeBtnName='Close';

}
}




