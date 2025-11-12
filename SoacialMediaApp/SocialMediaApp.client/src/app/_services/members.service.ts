import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
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
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));
  // members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member []> | null>(null);

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {
    const  response = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if(response) return this.setPaginatedResponse(response) ;
    console.log();
        let params = this.setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

        params = params.append('pageNumber', this.userParams().pageNumber);
        params = params.append('minAge', this.userParams().minAge);
        params = params.append('maxAge', this.userParams().maxAge);
        params = params.append('orderBy', this.userParams().orderBy);
        return this.http.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).subscribe({
      next: (response) => {
         this.setPaginatedResponse(response);
         this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    })
  }

  private setPaginatedResponse(response: HttpResponse<Member[]>){
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('pagination')!),
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
    const  member:Member = [...this.memberCache.values()]
      .reduce((arr, ele)=>arr.concat(ele.body),[])
      .find((tmp: Member)=>tmp.username === username);

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
