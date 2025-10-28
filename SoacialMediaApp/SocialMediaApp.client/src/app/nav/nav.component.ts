import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AccountService} from "../_services/account.service";
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {}
  private accountService = inject(AccountService);
  isLogged = false;

  protected login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next:(response)=>{
        this.isLogged = true;
      },
      error:(error)=>{
        console.log('Can\'t login cause: ' + error);
      },
      complete:()=>{
        console.log("Completed");
      }
    })
  }

  protected logout() {
    this.isLogged = false;
  }
}
