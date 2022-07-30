import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted: boolean = false;
  errorLogin: boolean = false;

  constructor(public authService: AuthService, private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    /* INITIALIZE INPUT FORM */
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  onSubmit(form: FormGroup) {
    this.authService.SignIn(form.value.email, form.value.password).then(() => {
      console.log("then block in sign in component running");
    }).catch((error) => {
      this.errorLogin = true;
      console.log("catch block in sign in component running");
      console.log("Error:" , error);
      return;
    });
  }
}
