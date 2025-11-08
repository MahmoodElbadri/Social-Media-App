import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { AccountService } from "../_services/account.service";
import { ToastrService } from "ngx-toastr";
import { JsonPipe } from '@angular/common';
import {TextInputComponent} from "../_forms/text-input/text-input.component";
import {DatePickerComponent} from "../_forms/date-picker/date-picker.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, TextInputComponent, DatePickerComponent],
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
  private fb = inject(FormBuilder);
  maxDate = new Date();
  private router = inject(Router);
  validationErrors: string[] | undefined = [];


  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password:  ['', Validators.required],
      confirmPassword:  ['', [Validators.required, this.matchValues('password')]],
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
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dob});
    const values = this.registerForm.value;
    delete values.confirmPassword;
    this.accountService.register(values).subscribe({
      next: _ => {
        this.router.navigateByUrl("/members");
        this.cancel();
      },
      error: (error) => {
        console.error('Raw Error:', error); // Keep this for debugging

        // CHECK 1: This is the one that matches your JSON
        if (error.error && error.error.errors) {
          this.validationErrors = Object.values(error.error.errors).flat().map(e => String(e));
        }
        // CHECK 2: Simple array of errors
        else if (Array.isArray(error.error)) {
          this.validationErrors = error.error;
        }
        // CHECK 3: Simple string error
        else if (typeof error.error === 'string') {
          this.validationErrors = [error.error];
        }
        // FALLBACK
        else {
          this.validationErrors = ['An unexpected error occurred.'];
        }
      },
      complete: () => {
        this.cancel();
        console.log("completed Register");
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string|undefined){
    if(!dob)return;
    return new Date(dob).toISOString().slice(0,10);
  }
}
