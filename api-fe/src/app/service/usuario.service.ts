import { UsuarioComponent } from './../components/usuario/usuario.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConstants } from '../app-constants';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuario(): Observable<User> {
    return this.http.get<User>(AppConstants.baseUrl)
  }

  getUsuarioId(id: Number): Observable<User> {
    return this.http.get<User>(AppConstants.baseUrl + id)
  }

  getUsuarioPagina(pagina: Number): Observable<User> {
    return this.http.get<User>(`${AppConstants.baseUrl}pagina/${pagina}`)
  }

  deleteUsuario(id: Number): Observable<void> {
    return this.http.delete<void>(AppConstants.baseUrl + id)
  }

  deleteTelefone(id: Number): Observable<void> {
    return this.http.delete<void>(`${AppConstants.baseUrl}deleteTelofone/${id}`)
  }

  salvaUsuario(user: User){
    if (user.id === undefined) {
      return this.http.post<User>(AppConstants.baseUrl, user)
    } else {
      return this.http.put<User>(AppConstants.baseUrl, user)
    }
  }

  buscaUsuario(busca: String): Observable<User> {
    return this.http.get<User>(`${AppConstants.baseUrl}usuarioBusca/${busca}`)
  }

  userAutenticado() {
    const token = localStorage.getItem('token')
    if (token !== null && token.toString().trim() !== null) {
      return true
    } else {
      return false
    }
  }
}
