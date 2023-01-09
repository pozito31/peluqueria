import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { map, Observable } from 'rxjs';
import { IBooking } from '../interfaces/ibooking';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  getBookings(): Observable<IBooking[]> {

    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');

    // IMPORTANTE: por temas de seguridad, se deshabilitara esta ruta, crea tu propio proyecto firebase
    const url = 'https://booking-app-65441-default-rtdb.firebaseio.com/bookings.json';

    return this.http.get<IBooking[]>(url, { headers: headers }).pipe(
      map(data => {
        let bookings = [];
        if (data) {
          console.log(data);
          // Obtengo el dia de hoy
          const today = new Date();
          // Recorro las llaves de la lista (ids firebase)
          _.forEach(_.keys(data), key => {
            // Creo el booking
            const booking = new Booking(data[key]);
            // Creo la fecha
            const bookingDate = new Date(booking.date);
            // Si la fecha es menor que hoy, no se mete
            if (bookingDate.getTime() >= today.getTime()) {
              bookings.push(booking);
            }

          })
        }
        // Ordeno las reservas por fecha
        bookings = _.orderBy(bookings, b => b.date)
        return bookings;
      })
    )
  }

  addBooking(booking: Booking) {

    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');

    // IMPORTANTE: por temas de seguridad, se deshabilitara esta ruta, crea tu propio proyecto firebase
    const url = 'https://booking-app-65441-default-rtdb.firebaseio.com/bookings.json';

    // Pasamos el objeto a cadena con JSON.stringify
    const body = JSON.stringify(booking.getData());

    return this.http.post(url, body, { headers: headers });

  }
}
