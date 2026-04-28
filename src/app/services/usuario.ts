import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 //to connect to the backend URL, where the user data is located
  private readonly API = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  login(credenciais: any): Observable<any> {
    return this.http.post(`${this.API}/login`, credenciais);
  }

  listarTodos(): Observable<any> {
    return this.http.get(this.API);
  }
}