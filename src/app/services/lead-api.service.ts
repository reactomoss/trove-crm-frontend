import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LeadApiService {
  baseURL = environment.baseUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private httpClient: HttpClient) {}

  initLeadForm(id = ''): Observable<any> {
    var param = '';
    if (id) {
      param = '/' + id;
    }
    let API_URL = `${this.baseURL + environment.leads + param}`;
    return this.httpClient.get(API_URL);
  }

  addLead(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.leads}`, data);
  }
}
