import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {
  baseURL = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private httpClient: HttpClient) { }
  // Settings Profile View From
  accountMe(): Observable<any> {
    let API_URL = `${this.baseURL + environment.me}`;
    return this.httpClient.get(API_URL);
  }

  updateProfile(data: any): Observable<any>{
    return this.httpClient.post(`${this.baseURL + environment.profile}`, data);
  }

  changePassword(data: any): Observable<any>{
    return this.httpClient.post(`${this.baseURL + environment.changePassword}`, data);
  }

}
