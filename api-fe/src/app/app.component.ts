import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'api-fe';

  constructor (private router: Router) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['login'])
    }
  }

  sair() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  esconderNav() {
    const token = localStorage.getItem('token')
    if (token !== null && token.toString().trim() !== null) {
      return false
    } else {
      return true
    }
  }
}
