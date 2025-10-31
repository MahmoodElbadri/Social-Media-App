import {Component, EventEmitter, inject, input, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AccountService} from "../_services/account.service";

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
  userFromHomeComponent = input.required<any>();
  @Output() cancelRegister = new EventEmitter();
  protected accountService = inject(AccountService);

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel();
      },
      error: (error) => {
        console.log(error);
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
