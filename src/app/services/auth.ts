import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loggedUser: any = null;
  private readonly API_MOVIES = 'http://localhost:8080/movies';
  private readonly API_AUTH = 'http://localhost:8080/auth/login';
  private readonly API_BASE = 'http://localhost:8080';
  private favoritesFilterSource = new BehaviorSubject<boolean>(false);
  favoritesFilter$ = this.favoritesFilterSource.asObservable();
  private sortNewestSource = new BehaviorSubject<boolean>(false);
  sortNewest$ = this.sortNewestSource.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    const salvo = localStorage.getItem('loggedUser');
    if (salvo) {
      this.loggedUser = JSON.parse(salvo);
    }

  }

  login(dados: any) {
    return this.http.post('http://localhost:8080/auth/login', dados, { withCredentials: true }).subscribe({
      next: (user: any) => {
        // 1. Guardamos o usuário SEM mostrar no console
        this.loggedUser = user;

        // 2. No localStorage, só fica o que é necessário para o Angular funcionar
        // (O Java já deve ter parado de enviar a senha no JSON)
        localStorage.setItem('loggedUser', JSON.stringify(user));

        if (user.role === 'ADM') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => alert('Login inválido!')
    });
  }

  isAuthenticated(): boolean { // used by the guard to check if someone is logged in
    return this.loggedUser !== null;
  }

  getRole(): String { // tells if the user is admin or normal user, used by the sidebar menu to hide or show buttons
    return this.loggedUser?.role;
  }

  logout() { // clears everything, removes localStorage, resets the variable and redirects the user back to login
    this.loggedUser = null;
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login']);
  }
  updateSortNewest(isNewest: boolean) {
    this.sortNewestSource.next(isNewest);
  }
  getMovies(page: number, userId?: number, sort: string = 'title,asc'): Observable<any> {
    let params = `?page=${page}&size=14&sort=${sort}`;

    if (userId) {
      params += `&userId=${userId}`;
    }

    return this.http.get(`http://localhost:8080/movies${params}`, { withCredentials: true });
  }
  getMoviesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_MOVIES}/${id}`);
  }
  updateFavoritesFilter(isVisible: boolean) {
    this.favoritesFilterSource.next(isVisible);
  }
  getFavoriteMovies(page: number, userId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/movies/favorites?page=${page}&userId=${userId}`, { withCredentials: true });
  }


  toggleFavorite(movieId: number): Observable<any> {
    const userJson = localStorage.getItem('loggedUser');
    const user = userJson ? JSON.parse(userJson) : null;

    // pega o ID do usuário 
    const userId = user ? user.id : null;

    // O Java agora espera o ID do filme na URL e o ID do usuário no corpo
    return this.http.post(
      `http://localhost:8080/movies/${movieId}/favorite`,
      userId, // Enviamos apenas o número do ID como corpo
      { withCredentials: true }
    );
  }

  saveMovie(movie: any): Observable<any> {
    if (movie.id) {
      // If it has an ID, it calls the PUT event that was created in Java
      return this.http.put(`${this.API_MOVIES}/${movie.id}`, movie);
    } else {
      // If there is no ID, call POST.
      return this.http.post(this.API_MOVIES, movie);
    }
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.API_MOVIES}/${id}`);
  }


}