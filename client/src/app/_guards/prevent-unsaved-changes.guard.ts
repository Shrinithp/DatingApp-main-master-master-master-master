import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
  canDeactivate(
    component: MemberEditComponent): boolean{
      if(component.editForm?.dirty){
        return confirm('are you sure you want continue any unsaved changes will be lost');
      }
      return true; //this return is to complete the program.
    }
    // this page is used so that user wil get alert that changing page while editing
    //may cause loss of changes.

}
  

