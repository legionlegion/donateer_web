import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {
  today = new Date();
  startDate = new Date();
  // duration?: Date;
  form!: FormGroup;
  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  constructor(public authService: AuthService, private formBuilder: FormBuilder, public afs: AngularFirestore,) { }

  async ngOnInit() {
    this.createForm();
    await this.afs.collection(
      `Organisations`
    ).get().toPromise().then((organisations) => {
      organisations?.forEach((organisation) => {
        console.log("Organisation data: ",organisation.data());
      });
    });
    console.log("USER DATA:", this.authService.userData)
  }

  createForm() {
    this.form = this.formBuilder.group({
      organisation: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: [{ value: '', disabled: true }, Validators.required],
    });
  }

  onSubmit(form: FormGroup) {

  }

  onChangeStartTime(time: Date) {
    console.log("TIme:", time)
    this.startDate = time;
    this.form.get("endTime")!.enable();
  }

  onChangeEndTime(time: Date) {
    let differenceMins = Math.floor((time.getTime() - this.startDate.getTime()) / 1000 / 60);
    console.log("DIFFERENCE: ", differenceMins)
  }

  onClear() {
    this.form.reset();
    this.form.get("endTime")!.disable();
  }

}