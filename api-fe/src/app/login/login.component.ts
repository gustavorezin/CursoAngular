import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  usuario = {login: '', senha: ''}

  constructor (private loginService: LoginService, private router: Router) {}

  public login() {
    this.loginService.login(this.usuario)
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if (token !== null && token.toString().trim() !== null) {
      this.router.navigate(['home'])
    }
  }

}
