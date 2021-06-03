import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  subject: ReplaySubject<any> = new ReplaySubject()
  obs: Observable<any> = this.subject.asObservable()

  baseURL = environment.baseUrl
  public searchText: string = null

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  public companyData = null
  public contactData = null

  constructor(private httpClient: HttpClient) {}

  /* Contact API Service */
  getContacts(): Observable<any> {
    const API_URL = `${this.baseURL + environment.contacts}`
    return this.httpClient.get(API_URL)
  }

  createContact(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.contacts}`, data)
  }

  getContactList(data): Observable<any> {
    const API_URL = `${this.baseURL + environment.contacts_index}`
    return this.httpClient.post(API_URL, data)
  }

  deleteContact(companyIds: any[]): Observable<any> {
    if (companyIds.length > 1) {
      const data = { ids: companyIds }
      const API_URL = `${this.baseURL + environment.contacts_delete_multiple}`
      return this.httpClient.post(API_URL, data)
    } else {
      const companyId = companyIds[0]
      const API_URL = `${
        this.baseURL + environment.contacts_delete
      }/${companyId}`
      return this.httpClient.delete(API_URL)
    }
  }

  /* Company API Service */
  getCompanies(): Observable<any> {
    const API_URL = `${this.baseURL + environment.company}`
    return this.httpClient.get(API_URL)
  }

  createCompany(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL + environment.company}`, data)
  }

  getCompanyList(data): Observable<any> {
    const API_URL = `${this.baseURL + environment.company_index}`
    return this.httpClient.post(API_URL, data)
  }

  deleteCompany(companyIds: any[]): Observable<any> {
    if (companyIds.length > 1) {
      const data = { ids: companyIds }
      const API_URL = `${this.baseURL + environment.company_delete_multiple}`
      return this.httpClient.post(API_URL, data)
    } else {
      const companyId = companyIds[0]
      const API_URL = `${
        this.baseURL + environment.company_delete
      }/${companyId}`
      return this.httpClient.delete(API_URL)
    }
  }

  /* Helper Functions */
  getCountries() {
    if (this.contactData) {
      return this.contactData.country
    }
    if (this.companyData) {
      return this.companyData.countries
    }
    return null
  }

  getEmailOwners() {
    if (this.contactData) {
      return this.contactData.owners
    }
    if (this.companyData) {
      return this.companyData.owners
    }
    return null
  }

  getContactCompanyList() {
    if (this.contactData) {
      return this.contactData.organizations;
    }
    return null;
  }

  getDialCodes() {
    const countries = this.getCountries()
    if (countries) {
      const dialCodes = countries
        .filter((x) => x.dial_code)
        .map((x) => x.dial_code)
      return this.sortDialCodes(dialCodes)
    }
    return null
  }

  private sortDialCodes(dialCodes: string[]) {
    return dialCodes.sort((a: string, b: string) => {
      const a1 = a.replace(/ /g, '')
      const b1 = b.replace(/ /g, '')
      if (a1.length < b1.length) return -1
      else if (a1.length > b1.length) return 1
      return a1.localeCompare(b1)
    })
  }

  notify() {
    this.subject.next()
  }

  ngOnDestroy() {}
}
