import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from "../../_services/account.service";
import { MembersService } from "../../_services/members.service";
import { Member } from "../../_models/member";
import { MemberCardComponent } from "../member-card/member-card.component";
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination";
import {UserParams} from "../../_models/UserParams";
import {FormsModule} from "@angular/forms";
import {ButtonsModule} from "ngx-bootstrap/buttons";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    MemberCardComponent,
    PaginationModule,
    FormsModule,
    ButtonsModule
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  accountService = inject(AccountService);
  membersService = inject(MembersService);
  userParams = new UserParams(this.accountService.currentUser());
  pageNumber = 1;
  pageSize = 5;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  ngOnInit(): void {
    if (!this.membersService.paginatedResult()) {
      this.loadMembers();
    }
  }

  resetFilters(){
    this.userParams = new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }

  loadMembers() {
    this.membersService.getMembers(this.userParams);
  }

  pageChanged(event: any) {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
