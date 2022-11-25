import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: { login: any; senha?: string; }) {
    return this.http.post(AppConstants.baseLogin, JSON.stringify(usuario)).subscribe(data => {

      const token = JSON.parse(JSON.stringify(data)).Authorization.split(' ')[1]

      localStorage.setItem('token', token)

      console.info("Token: " + localStorage.getItem('token'))

      this.router.navigate(['home']);

    }, error => {
      console.error("Erro ao fazer login")
      alert("Login ou senha inválido")
    }
    ) // Retorno HTTP
  }
}
