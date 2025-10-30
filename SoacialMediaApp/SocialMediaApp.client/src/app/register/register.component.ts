import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  model:any = {
  }
  // @Input() userFromHomeComponent: any;
  userFromHomeComponent = input.required<any>();
  @Output() cancelRegister = new EventEmitter();
register(){
console.log(this.model);
}
cancel(){
    this.cancelRegister.emit(false);
}
}
