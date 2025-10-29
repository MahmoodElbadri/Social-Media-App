import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NavComponent} from "./nav/nav.component";
import {AccountService} from "./_services/account.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'SocialMediaApp.client';
  http = inject(HttpClient);
  users: any;
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString)return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  getUsers(){
    this.http.get("https://localhost:5001/api/Users").subscribe({
      next: (res)=>{
        this.users = res;
      },
      error: (err)=>{
        console.log(err);
      },
      complete: ()=>{
        console.log("Completed");
      }
    })
  }

}
