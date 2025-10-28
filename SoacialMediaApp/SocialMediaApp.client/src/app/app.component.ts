import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {NgForOf} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NavComponent} from "./nav/nav.component";

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

  ngOnInit(): void {
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
