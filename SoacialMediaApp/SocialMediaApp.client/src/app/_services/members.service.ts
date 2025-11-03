import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Member} from "../_models/member";
import {AccountService} from "./account.service";
import {of, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  http = inject(HttpClient);
  accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users').subscribe({
      next: (res) => {
        this.members.set(res);
      }
    })
  }

  getMember(username: string) {
    let member = this.members().find(tmp => tmp.username === username);
    if (member !== undefined) {
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      tap(() => {
        this.members.update(mem=>mem.map(tmp=>tmp.username === member.username
        ? member: tmp))
      })
    )
  }
}
