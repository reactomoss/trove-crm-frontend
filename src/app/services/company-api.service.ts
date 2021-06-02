import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CompanyApiService {
  baseURL = environment.baseUrl;
  public searchText: string = null

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) {}

  getCompanyCreateForm(): Observable<any> {
    const API_URL = `${this.baseURL + environment.company}`;
    return this.httpClient.get(API_URL)
  }

  createCompany(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.company}`, data);
  }

  getCompanyList(data): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_index}`;
    return this.httpClient.post(API_URL, data);
  }

  deleteCompany(companyIds: any[]): Observable<any> {
    if (companyIds.length > 1) {
      const data = {ids: companyIds}
      const API_URL = `${this.baseURL + environment.company_delete_multiple}`;
      return this.httpClient.post(API_URL, data);
    }
    else {
      const companyId = companyIds[0]
      const API_URL = `${this.baseURL + environment.company_delete}/${companyId}`;
      return this.httpClient.delete(API_URL);
    }
  }
  
  subject: ReplaySubject<any> = new ReplaySubject();
  obs: Observable<any> = this.subject.asObservable();

  notify() {
    this.subject.next()
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
    return throwError(errorMessage);
  }

  ngOnDestroy() {
    
  }
}
