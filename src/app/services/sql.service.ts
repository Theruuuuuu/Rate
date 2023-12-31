import { Injectable } from '@angular/core';
import { info } from '../model/model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SqlService {
  companies:any[] = []

  locaturl = './assets/company.json'
  url = 'https://esgprojapi.azurewebsites.net/api/Finance/'

  constructor(private http:HttpClient) { }
  
  jsonget(){
    return this.http.get<info[]>(this.locaturl)
  }

  getrate(ticker:string){
    return this.http.get<any[]>(this.url+ticker)
  }

}
