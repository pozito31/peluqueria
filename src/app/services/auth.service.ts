import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(infoLogin: any): Observable<boolean> {

    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');

    // IMPORTANTE: por temas de seguridad, se deshabilitara esta ruta, crea tu propio proyecto firebase
    const url = 'https://booking-app-65441-default-rtdb.firebaseio.com/users.json';

    return this.http.get<boolean>(url, { headers: headers }).pipe(
      map(users => {

        // Busco el usuario
        const user = _.find(users, u => u.user === infoLogin.user && u.pass == infoLogin.pass);

        // Si existe, lo indico
        if (user) {
          return true;
        }

        return false;
      })
    )

  }

  isAuthenticated() {
    return localStorage.getItem("logged");
  }
}
