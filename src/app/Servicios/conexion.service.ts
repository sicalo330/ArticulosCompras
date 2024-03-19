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
  myProducto:string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = '/Articulos';
    this.myProducto = '/Productos'
  }

  getArticulos(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myApiUrl + '/getArticulos')
  }

  filtrarInformacionArticulos(grupo:any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myApiUrl + '/filtrar', {Grupo:grupo})
  }
  
  getProductos(): Observable<any>{
    return this.http.get(this.myAppUrl + this.myProducto + '/getProductos')
  }

  filtrarProductos(grupo:any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myProducto + '/filtrarProductos', {Grupo:grupo})
  }

  filtrarEmpresa(empresa:any): Observable<any>{
    return this.http.post(this.myAppUrl + this.myProducto + '/filtrarEmpresa',{Empresa:empresa} )
  }

  filtrarInformacionProductos(grupo:any): Observable<any>{
    console.log(grupo)
    return this.http.post(this.myAppUrl + this.myProducto + '/filtrar', {Grupo:grupo})
  }
}
