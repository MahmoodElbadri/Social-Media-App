import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.css'
})
export class TestErrorComponent {
  baseUrl = 'http://localhost:5002/api';
  http = inject(HttpClient);

  get400Error() {
    this.http.get(this.baseUrl + '/buggy/bad-request').subscribe({
      next: () => console.log('success'),
      error: (err) => console.log(err)
    })
  }

  get404Error() {
    this.http.get(this.baseUrl + '/buggy/not-found').subscribe({
      next: () => console.log('success'),
      error: (err) => console.log(err)
    })
  }

  get500Error() {
    this.http.get(this.baseUrl + '/buggy/server-error').subscribe({
      next: () => console.log('success'),
      error: (err) => console.log(err)
    })
  }

  get400ValidationError() {
    this.http.post(this.baseUrl + '/auth/register', {}).subscribe({
      next: () => console.log('success'),
      error: (err) => console.log(err)
    })
  }
}
