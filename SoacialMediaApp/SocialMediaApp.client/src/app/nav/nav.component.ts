import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AccountService} from "../_services/account.service";
import {NgIf} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {}
  accountService = inject(AccountService);

  protected login() {
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (response) => {
      },
      error: (error) => {
        console.log('Can\'t login cause: ' + error);
      },
      complete: () => {
        console.log("Completed");
      }
    })
  }

  protected logout() {
    this.accountService.logout();
  }
}
