import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit{

  //populate properties from into this from user-mangement component
 username='';
 availableRoles: any[] = [];
 selectedRoles: any[] = [];


constructor(public bsModalRef: BsModalRef) {

  
}

  ngOnInit(): void {
  }


  /**go through this section again */
  updatedChecked(checkedValue: string) {
    const index = this.selectedRoles.indexOf(checkedValue);
    
    //if index=-1 that means it is not inside selected roles array
    index != -1? this.selectedRoles.splice(index,1) : this.selectedRoles.push(checkedValue)
  }

}
