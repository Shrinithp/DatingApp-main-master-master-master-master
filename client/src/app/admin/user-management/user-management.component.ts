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
//modal file used to pass data to roles modal component.
bsModalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
availableRoles =[
  'Admin',
  'Moderator',
  'Member'
]

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

openRolesModal(user: User){

//properties that we are going to pass inside modal
const config = {
  class: 'modal-dialog-centered',
  initialState: {
    username: user.username,
    availableRoles: this.availableRoles,
    //spread operator because we want individual role that are there inside the user
    selectedRoles: [...user.roles]
  }
}
//after this parameters will go inside role-modal and then we will check and then update selectedrole there
//chnages in API is the made here after we hide the modal.
  this.bsModalRef = this.modalService.show(RolesModalComponent,config);

  //defines what happens when we hide the modal

  this.bsModalRef.onHide?.subscribe({
    //() call back function
    //callback's primary purpose is to execute code in response to an event
    next: () =>{
     //if user doesnot change the role, we donot want to send request to api when modal is closed.
     const selectedRoles = this.bsModalRef.content?.selectedRoles;

     //to check if two arrays are equal
     if(!this.arrayEqual(selectedRoles!, user.roles)) {
      this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
        next: roles=>user.roles = roles
      })
     }
     
    }
  })

}

private arrayEqual(arr1: any, arr2:any[]) {
  return JSON.stringify(arr1.sort())===JSON.stringify(arr2.sort());
}
}




