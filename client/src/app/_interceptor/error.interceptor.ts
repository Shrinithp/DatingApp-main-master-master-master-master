import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
//HttpInterceptor Intercepts and handles an HttpRequest or HttpResponse
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  //  interceptor allows intercept and handle specific error statuses returned by the server.

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
    catchError((error:HttpErrorResponse) =>{
      if(error){
        switch(error.status){
          case 400:
            //normal error sent. error object has error property 
            //that error property has error nested in it.
            if(error.error.errors){
              const modelStateErrors=[];
              for(const key in error.error.errors){
                if(error.error.errors[key]){
                  modelStateErrors.push(error.error.errors[key])
                }
              }
              throw modelStateErrors.flat();
            }
              else{
                //error that we created
                alert(error.error)
              }
              break;
            case 401:
              alert('unauthorized');
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              //error is in router state and can be accessed using navigationExtras.
              const navigationExtras: NavigationExtras ={state:{error:error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
              default:
                alert("unexpected error");
                console.log(error);
                break;
         
        }
      }
      throw error;
    })

    )
  }
}
