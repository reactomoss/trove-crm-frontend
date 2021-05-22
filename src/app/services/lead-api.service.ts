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

  listLeadGridView(
    pipeline_id: string,
    sort: string = "",
    order: string = "",
    search: string = ""
  ): Observable<any> {
    var start, length;
    var items_per_page = 10;

    var data = {
      pipeline_id: pipeline_id,
      search: search,
    };
    if ((typeof sort != 'undefined' && sort != "") && (typeof order != 'undefined' && sort != "")) {
      data['order'] = [{ column: sort, dir: order }];
    }
    return this.httpClient.post(
      `${this.baseURL + environment.leads + "/grid"}`,
      data
    );
  }


  getPipelines(): Observable<any>{
    return this.httpClient.get(`${this.baseURL + environment.pipelineMaster}`);
  }


}
