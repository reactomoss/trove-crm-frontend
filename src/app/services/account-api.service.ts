import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';



@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  baseURL = environment.baseUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {}

  // Create
  createAccount(data): Observable<any> {
    let API_URL = `${this.baseURL + environment.register}`;
    return this.httpClient.post(API_URL, data, this.httpOptions)
      /*.pipe(
        catchError(this.handleError)
      )*/
  }

  //login
  login(data): Observable<any> {
    let API_URL = `${this.baseURL + environment.login}`;
    return this.httpClient.post(API_URL, data, this.httpOptions);
  }

  sendPasswordResetLink(email): Observable<any> {
    let API_URL = `${this.baseURL + environment.sendPasswordResetLink}`;
    return this.httpClient.post(API_URL, {"email" : email}, this.httpOptions);
  }

  isLoggedIn(){
    if (localStorage.getItem("token") === null) {
      return false;
    }
    return true;
  }

  // Handle Errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    console.log("response", error);
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
