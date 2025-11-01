import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {NavigationExtras, Router} from "@angular/router";
import {catchError, throwError} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError(error => {
      if(error.status === 400){
        if(error.error.errors){
          const modelStateErrors = [];
          for (const key in error.error.errors) {
            modelStateErrors.push(error.error.errors[key]);
          }
          throw error.error;
        }
        toastr.error(error.error, error.status.toString());
      }
      if(error.status === 401){
        toastr.error(error.error, error.status.toString());
      }
      if(error.status === 404){
        router.navigate(['/not-found']);
      }
      if(error.status === 500){
        const navigationExtras: NavigationExtras = {
          state: {error: error.error}
        }
        router.navigate(['/server-error', error.error], navigationExtras);
      }
      else{
        toastr.error('something unexpected went wrong');
      }
      return throwError(() => error);
    })
  );

};
