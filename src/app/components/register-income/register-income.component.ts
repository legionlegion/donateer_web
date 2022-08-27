import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.css']
})
export class RegisterIncomeComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  errorLogin: boolean = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder,) { 
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    /* INITIALIZE INPUT FORM */
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      income: ['', Validators.compose([Validators.required])],
    });
  }

  onSubmit(form: FormGroup) {
    this.authService.SignUp(form.value.email, form.value.password).then(() => {
      console.log("then block in sign up component running")
    }).catch((error) => {
      this.errorLogin = true;
      console.log("catch block in sign up component running");
      console.log("Error:" , error);
      return
    });
  }

}
