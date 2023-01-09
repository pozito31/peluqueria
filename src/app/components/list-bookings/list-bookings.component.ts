import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBooking } from 'src/app/interfaces/ibooking';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-list-bookings',
  templateUrl: './list-bookings.component.html',
  styleUrls: ['./list-bookings.component.css']
})
export class ListBookingsComponent implements OnInit {
  public listBookings: IBooking[];
  public loadBookings: boolean;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {
    this.listBookings = [];
    this.loadBookings = false;
  }
  ngOnInit() {
    // Si estoy logueado, recojo las reservas
    if (this.authService.isAuthenticated()) {
      this.bookingService.getBookings().subscribe(list => {
        this.listBookings = list;
        this.loadBookings = true;
      }, error => {
        console.log("No se ha podido recuperar los bookings: " + error);
        this.loadBookings = true;
      })
    } else {
      // Sino vuelvo al inicio
      this.router.navigate(['/add-booking'])
    }
  }
}
