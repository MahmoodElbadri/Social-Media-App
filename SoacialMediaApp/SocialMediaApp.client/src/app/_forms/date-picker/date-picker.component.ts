import {Component, inject, input, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule} from "@angular/forms";
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BsDatepickerModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor {
  label = input<string>('');
  maxDate = input<Date>();

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    // Set maxDate if provided, otherwise default to today
    const maxDateValue = this.maxDate() || new Date();

    this.bsConfig = {
      containerClass: 'theme-red',
      showWeekNumbers: false,
      dateInputFormat: 'DD MMM YYYY',
      adaptivePosition: true,
      maxDate: this.maxDate()
    };
  }


  writeValue(obj: any): void {
    // Implement writeValue
  }

  registerOnChange(fn: any): void {
    // Implement registerOnChange
  }

  registerOnTouched(fn: any): void {
    // Implement registerOnTouched
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
