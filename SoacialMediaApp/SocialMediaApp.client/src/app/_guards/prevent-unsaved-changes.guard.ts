import {CanDeactivateFn} from "@angular/router";
import {MemberEditComponent} from "../members/member-edit/member-edit.component";

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component, currentRoute, currentState, nextState) => {
  if(component.profileForm?.dirty){
    return confirm("Are you sure you want to leave this page? Any unsaved changes will be lost.")
  }
  return true;
};
