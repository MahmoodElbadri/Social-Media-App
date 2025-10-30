import {Component, inject, OnInit} from '@angular/core';
import {RegisterComponent} from "../register/register.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RegisterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  registerMode = false;
  http = inject(HttpClient);
  users: any;

  ngOnInit(): void {
    this.getUsers();
  }

  toggleRegister() {
    this.registerMode = !this.registerMode;
  }

  getUsers(){
    this.http.get("http://localhost:5002/api/Users").subscribe({
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

  protected cancelRegisterMode($event: boolean) {
    this.registerMode = false;
  }
}
