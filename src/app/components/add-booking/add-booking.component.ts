import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Booking } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddBookingComponent {

  // ViewChild tienen la referencia de una plantilla en HTML
  @ViewChild("modal_success", { static: false }) modal_success;
  @ViewChild("modal_exists", { static: false }) modal_exists;

  public options: string[];
  public locale: any;
  public today: Date;
  public formBooking: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private modalService: NgbModal
  ) {
    // Opciones del select
    this.options = ['haircut', 'hair-coloring', 'hair-washing', 'hair-straightening']
    // Segun el idioma, cogera un objeto u otro, usado para el p-calendar
    if (navigator.language == 'es-ES') {
      this.locale = {
        firstDayOfWeek: 1,
        dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
        dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
        dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
        monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
        today: 'Hoy',
        clear: 'Borrar'
      }
    } else {
      this.locale = {
        firstDayOfWeek: 0,
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: 'Today',
        clear: 'Clear',
        dateFormat: 'mm/dd/yy',
        weekHeader: 'Wk'
      }
    }
    // Dia de hoy
    this.today = new Date();

    // Si la hora del dia es menor que 30, la proxima reserva se puede hacer a y media
    if (this.today.getMinutes() < 30) {
      this.today.setMinutes(30);
    } else {
      // Sino, sera en la siguiente hora
      this.today.setHours(this.today.getHours() + 1);
      this.today.setMinutes(0);
    }

    // Recomendado para no tener problemas con las fechas
    this.today.setSeconds(0);
    this.today.setMilliseconds(0);

    // Creo el formGroup
    this.formBooking = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      date: new FormControl(this.today),
      service: new FormControl(this.options[0])
    })
  }

   get name() {
    return this.formBooking.get('name');
   }

  get date() {
    return this.formBooking.get('date');
  }

  get service() {
    return this.formBooking.get('service');
  }

  addBooking() {
    console.log(this.formBooking.value);
    // Creo el booking con los datos del formulario
    const booking = new Booking(this.formBooking.value);

    // Obtengo los bookings para comprobar si existe alguno en la misma hora
    this.bookingService.getBookings().subscribe(bookings => {

      console.log(bookings);

      // Busco si existe el booking
      const bookingFound = _.find(bookings, b => {
        const date = new Date(b.date);
        const dateNewBooking = new Date(booking.date);
        return date.getTime() === dateNewBooking.getTime();
      });

      // Si existe, sale el modal indicandolo
      if (bookingFound) {
        this.modalService.open(this.modal_exists);
      } else {
        // Añado la reserva
        this.bookingService.addBooking(booking).subscribe(id => {
          console.log("Se ha insertado con el siguiente id: ", id);
          this.modalService.open(this.modal_success);
        }, error => {
          console.error("Se ha producido un error: " + error);
        });
      }

    })
  }
}
