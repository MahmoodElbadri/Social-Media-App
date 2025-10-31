import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../_models/user";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient)
  baseUrl = 'http://localhost:5002/api/Account/';
  currentUser = signal<any | User>(null);

  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  register(model: any){
    return  this.http.post<User>(this.baseUrl+ 'register', model).pipe(
      map(user=>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
         return user;
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
