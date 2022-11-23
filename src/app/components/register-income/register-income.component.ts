import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-income',
  templateUrl: './register-income.component.html',
  styleUrls: ['./register-income.component.css']
})
export class RegisterIncomeComponent implements OnInit {

  form!: FormGroup;
  submitted: boolean = false;
  errorLogin: boolean = false;
  accountDetails: any;

  constructor(public authService: AuthService, private formBuilder: FormBuilder, public router: Router) { 
    const navigation = this.router.getCurrentNavigation();
    this.accountDetails = navigation!.extras.state;
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    /* INITIALIZE INPUT FORM */
    this.form = this.formBuilder.group({
      //email: ['', Validators.compose([Validators.required])],
      //password: ['', Validators.compose([Validators.required])],
      income: ['', Validators.compose([Validators.required])],
    });
  }

  onSubmit(form: FormGroup) {
    this.authService.SignUp(this.accountDetails, form.value.income).then(() => {
      console.log("then block in sign up component running")
    }).catch((error) => {
      this.errorLogin = true;
      console.log("catch block in sign up component running");
      console.log("Error:" , error);
      return
    });
  }

}
