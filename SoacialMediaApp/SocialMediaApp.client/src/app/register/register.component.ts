import {Component, EventEmitter, inject, input, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AccountService} from "../_services/account.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model: any = {}
  // @Input() userFromHomeComponent: any;
  userFromHomeComponent = input<any>();
  @Output() cancelRegister = new EventEmitter();
  protected accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.error);
      },
      complete:()=>{
        this.cancel();
        console.log("completed Register");
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
