import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from "@angular/forms";
import { AccountService } from "../_services/account.service";
import { ToastrService } from "ngx-toastr";
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe],
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
      username: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')]),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      }
    })
  }

  matchValues(matchTo: string):ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
       ? null
       : {notMatching: true} //this name will be used in the template to check for the error keep it in mind
    }
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
