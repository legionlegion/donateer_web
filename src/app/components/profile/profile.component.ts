import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any;
  loaded = false;
  totalHours = 0;
  totalAmount = 0;
  constructor(public authService: AuthService,  public afs: AngularFirestore, public afAuth: AngularFireAuth,
    public router: Router) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user: any) => {
      this.afs.collection(
        'Users'
      ).doc(user.uid).get().toPromise().then((x: any) => {
        this.userData = x.data();
        console.log('userdata:', this.userData);
        if (this.userData.donations === null || this.userData.donations === undefined) {
          this.userData.donations = [];
        }
        for (var donation of this.userData.donations) {
          this.totalAmount += donation.donatedAmount;
          this.totalHours += donation.duration;
        }
        this.totalHours /= 60;
        this.totalHours = parseFloat(this.totalHours.toFixed(2));
        this.loaded = true;
        console.log("User document", this.userData);
      });
    });
  }
}
