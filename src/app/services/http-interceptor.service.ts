import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private token: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    console.log("Interceptor");
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token.get()}`
      }
    });
    return next.handle(newReq);
  }
}
