import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   // Atributos
  public formLogin: FormGroup;
  public showLoginSuccess: boolean;
  public showLoginError: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Creo el formGroup
    this.formLogin = this.formBuilder.group({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required)
    });
    this.showLoginSuccess = false;
    this.showLoginError = false;
  }

  checkLogin() {

    // Reinicio para que no haya problemas tras varios intentos
    this.showLoginSuccess = false;
    this.showLoginError = false;

    // Compruebo si es correcto
    this.authService.login(this.formLogin.value).subscribe(success => {

      console.log(success);
      if(success){
        this.showLoginSuccess = true;
        // Redirijo a la lista de bookings
        this.router.navigate(['/list-bookings']);
        // Indico que estoy logueado
        localStorage.setItem("logged", "1");
        // Cierro la ventana
        this.activeModal.close();
      }else{
        this.showLoginError = true;
      }
    });

  }

}
