import {Component, inject, OnInit} from '@angular/core';
import {AccountService} from "../../_services/account.service";
import {MembersService} from "../../_services/members.service";
import {Member} from "../../_models/member";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {


  accountService = inject(AccountService);
  membersService = inject(MembersService);
  members: Member[] = [];

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.membersService.getMembers().subscribe({
      next:(res)=>{
        this.members = res;
      }
    })
  }
}
