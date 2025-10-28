import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient)
  baseUrl = 'http://localhost:5002/api/Account/login'

  login(model: any) {
    return this.http.post(this.baseUrl, model);
  }
}
