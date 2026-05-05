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

  listAll(page: number = 0, size: number = 5): Observable<any> {
    return this.http.get(`${this.API}?page=${page}&size=${size}`, { withCredentials: true });
  }
  findById(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`, { withCredentials: true });
  }
  create(user: any): Observable<any> {
    return this.http.post(this.API, user, { withCredentials: true });
  }
  update(id: number, user: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, user, { withCredentials: true });
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, { withCredentials: true });
  }
  
}