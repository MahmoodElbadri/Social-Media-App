import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Member} from "../_models/member";
import {AccountService} from "./account.service";
import {of, tap} from "rxjs";
import {Photo} from "../_models/photo";
import {PaginatedResult} from "../_models/Pagination";
import {UserParams} from "../_models/UserParams";


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  http = inject(HttpClient);
  accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  // members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member []> | null>(null);

  getMembers(userParams: UserParams) {
        let params = this.setPaginationHeaders(userParams.pageNumber, userParams.pageSize);

        params = params.append('pageNumber', userParams.pageNumber);
        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('orderBy', userParams.orderBy);
        return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).subscribe({
      next: (response) => {
         this.paginatedResult.set({
           items: response.body as Member[],
           pagination: JSON.parse(response.headers.get('pagination')!),
         })
      }
    })
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();
    if(pageNumber && pageSize){
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }

  getMember(username: string) {
    // let member = this.members().find(tmp => tmp.username === username);
    // if (member !== undefined) {
    //   return of(member);
    // }
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      // tap(() => {
      //   this.members.update(mem => mem.map(tmp => tmp.username === member.username
      //     ? member : tmp))
      // })
    )
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'users/' + `set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     // Create a new member object to ensure proper reactivity
      //     const updatedMember = { ...m };
      //
      //     // Update the photoUrl if this member contains the photo being set as main
      //     if (updatedMember.photos.some(p => p.id === photo.id)) {
      //       updatedMember.photoUrl = photo.url;
      //     }
      //
      //     // Update the photos array to set the correct photo as main
      //     updatedMember.photos = updatedMember.photos.map(p => {
      //       if (p.id === photo.id) {
      //         // Set this photo as main
      //         return { ...p, isMain: true };
      //       } else if (p.isMain) {
      //         // Set any existing main photo as not main
      //         return { ...p, isMain: false };
      //       }
      //       return p;
      //     });
      //
      //     return updatedMember;
      //   }));
      // })
    );
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'Users/delete-photo/' + photo.id).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     // Create a new member object to ensure proper reactivity
      //     const updatedMember = { ...m };
      //
      //     // Update the photoUrl if this member contains the photo being set as main
      //     if (updatedMember.photos.some(p => p.id === photo.id)) {
      //       updatedMember.photoUrl = photo.url;
      //     }
      //
      //     // Update the photos array to set the correct photo as main
      //     updatedMember.photos = updatedMember.photos.map(p => {
      //       if (p.id === photo.id) {
      //         // Set this photo as main
      //         return { ...p, isMain: true };
      //       } else if (p.isMain) {
      //         // Set any existing main photo as not main
      //         return { ...p, isMain: false };
      //       }
      //       return p;
      //     });
      //
      //     return updatedMember;
      //   }));
      // })
    );
  }
}
