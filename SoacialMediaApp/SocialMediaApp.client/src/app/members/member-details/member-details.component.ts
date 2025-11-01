import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Member} from "../../_models/member";
import {MembersService} from "../../_services/members.service";

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  protected member?: Member;
  private memberService = inject(MembersService);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member;
        console.log(this.member);
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
