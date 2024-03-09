import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  myAppUrl: string;
  myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/Articulos';
  }

  getArticulos(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl + '/getProductos')
  }

  filtrarInformacion(grupo:any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myApiUrl + '/filtrar', {Grupo:grupo})
  }
}
