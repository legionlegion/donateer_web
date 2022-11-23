import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { render } from 'creditcardpayments/creditCardPayments';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  donationDetails: any;
  userData: any;
  userDocument: any;
  existingDonations: any;
  paypal: any;

  constructor(public authService: AuthService, public afs: AngularFirestore, public afAuth: AngularFireAuth,
    public router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.donationDetails = navigation!.extras.state;
    console.log("Donation details: ", this.donationDetails);
    
  }

  async ngOnInit() {
    this.afAuth.authState.subscribe((user: any) => {
      this.userData = user;
      this.existingDonations = this.afs.collection(
        'Users'
      ).doc(this.userData.uid).get().toPromise().then((x: any) => {
        this.userDocument = x.data();
        this.existingDonations = this.userDocument['donations'];
      });
    });
    render({
      id: "#paypalButton",
      currency: "SGD",
      //value: this.donationDetails.donatedAmount,
      value: "5",
      onApprove: (details) => {
        alert("success");
        this.onSubmit();
      }});
  }

  async onSubmit() {
    this.existingDonations.push(this.donationDetails);
    await this.afs.collection(
      'Users'
    ).doc(this.authService.userData.uid).update({
      'donations': this.existingDonations,
    });
    this.router.navigate(['profile']);
  }

}
