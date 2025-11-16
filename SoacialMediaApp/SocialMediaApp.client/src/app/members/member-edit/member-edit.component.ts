import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {Member} from "../../_models/member";
import {AccountService} from "../../_services/account.service";
import {MembersService} from "../../_services/members.service";
import {GalleryComponent} from "ng-gallery";
import {TabsModule} from "ngx-bootstrap/tabs";
import {FormsModule, NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {PhotoEditorComponent} from "../photo-editor/photo-editor.component";
import {TimeagoModule} from "ngx-timeago";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    GalleryComponent,
    TabsModule,
    FormsModule,
    PhotoEditorComponent,
    TimeagoModule,
    DatePipe
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.profileForm?.dirty) {
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
      return;
    }
    this.memberService.getMember(user.userName).subscribe({
      next: member => {
        this.member = member;
      }
    })
  }

  protected updateMember() {
    this.memberService.updateMember(this.profileForm?.value).subscribe({
      next: _ => {
        this.toastr.info("member updated successfully");
        this.profileForm?.reset(this.member);
      }
    })
  }

  onMemberChange(event: Member){
    this.member = event;
  }
}
