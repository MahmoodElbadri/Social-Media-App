import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccountService } from "../_services/account.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  model: any = {}
  // @Input() userFromHomeComponent: any;
  userFromHomeComponent = input<any>();
  @Output() cancelRegister = new EventEmitter();
  protected accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  registerForm: FormGroup = new FormGroup({});


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),

    });
  }

  register() {
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe({
    //   next: () => {
    //     this.cancel();
    //   },
    //   error: (error) => {
    //     console.log(error);
    //     this.toastr.error(error.error);
    //   },
    //   complete: () => {
    //     this.cancel();
    //     console.log("completed Register");
    //   }
    //});

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
