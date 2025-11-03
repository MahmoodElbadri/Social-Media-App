import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import { AccountService } from "../../_services/account.service";
import {MembersService} from "../../_services/members.service";
import {GalleryComponent} from "ng-gallery";
import {TabsModule} from "ngx-bootstrap/tabs";
import {FormsModule, NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    GalleryComponent,
    TabsModule,
    FormsModule
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements  OnInit{

  @HostListener('window:beforeunload', ['$event']) notify($event: any){
    if(this.profileForm?.dirty){
      $event.returnValue = true;
    }
  }
  @ViewChild('profileForm') profileForm?: NgForm;
  member?: Member;
  accountService = inject(AccountService);
  memberService = inject(MembersService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    const user = this.accountService.currentUser();
    if (!user) {
      console.log("no user");
      return;
    }
    console.log("the if condition has been done" + user);
    this.memberService.getMember(user.userName).subscribe({
      next: member => {
        console.log("request succeeded");
        this.member = member;
        console.log(this.member);
      }
    })
  }

  protected updateMember() {
    console.log(this.member);
    this.toastr.info("member updated successfully");
    
    this.profileForm?.reset(this.member);
  }
}
