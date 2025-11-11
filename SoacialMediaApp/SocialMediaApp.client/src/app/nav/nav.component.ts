import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AccountService} from "../_services/account.service";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {ToastrService} from "ngx-toastr";


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
  router = inject(Router)
  accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  protected login() {
    this.accountService.login(this.model).subscribe({
      next: (response) => {
        void this.router.navigateByUrl("/members");
      },
      error: (err) => {
        // this.toastr.error(err.error);
        this.toastr.error('Check console for details');
      },
      complete: () => {
        console.log("Completed");
      }
    })
  }

  protected logout() {
    this.accountService.logout();
    void this.router.navigateByUrl("/");
  }
}
