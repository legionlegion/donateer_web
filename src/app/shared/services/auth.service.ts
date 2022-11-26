import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  userData: any; // Save logged in user data
  registerUserData: any;
  isGoogle = false;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        console.log("RECEIVED USER DATA")
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        console.log('sign-in result:', result.user);
        
        await this.SetUserData(result.user);
        this.ngZone.run(() => {
          console.log("Navigating to dashboard")
          this.router.navigate(['dashboard']);
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  // Sign up with email/password
  SignUpOne(email: string, password: string, displayName: string) {
    this.registerUserData = {
      email: email,
      password: password,
      displayName: displayName
    }
    this.router.navigate(['register-income']);
  }

  SignUpTwo(income: string) {
    this.registerUserData.income = income;
    if (!this.isGoogle) {
      // regular sign up
      return this.afAuth
      .createUserWithEmailAndPassword(this.registerUserData.email, this.registerUserData.password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        console.log('sign up result:', result.user)
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
        this.router.navigate(['register-user']);
      });
    } else {
      // Google sign up
      // Google's registerUserData is same as result.user 
      return this.SetUserData(this.registerUserData).then(() => {
        this.router.navigate(['dashboard']);
      });
    }
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // edit profile
  EditProfile(displayName: string ) {
        console.log('In Update profile');
        return this.afAuth.currentUser
          .then((u: any) => {
              u.updateProfile({
            displayName: displayName,

        })
        this.ngZone.run(() => {
          console.log("Navigating to dashboard")
          this.router.navigate(['profile']);
        });
        });
    }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log("Is user null? ", user)
    return user !== null;
    // return user !== null && user.emailVerified !== false ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
      if (res) {
        // the code below does not run because of no res returned from AuthLogin
        console.log("Navigating to dashboard")
        this.router.navigate(['dashboard']);
      }
    });
  }

  AuthLogin(provider: any) {
    this.isGoogle = true;
    return this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        this.registerUserData = result.user;
        this.afAuth.authState.subscribe((user: any) => {
          this.afs.collection(
            'Users'
          ).doc(this.userData.uid).get().toPromise().then((x: any) => {
            let userDocument = x.data();
            console.log("User document", userDocument);
            if (userDocument.income !== null) {
              console.log('has income')
              this.router.navigate(['dashboard']);
            } else {
              console.log('no income')
              this.router.navigate(['register-income']);
            }
          });
        });
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Auth logic to run auth providers
  // AuthLogin(provider: any) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then(async (result) => {
  //       await this.SetUserData(result.user);

  //       this.ngZone.run(() => {
  //         console.log("Navigating to dashboard")
  //         this.router.navigate(['dashboard']);
  //       });
  //     })
  //     .catch((error) => {
  //       window.alert(error);
  //     });
  // }

  /* Setting up user data when sign in with email/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `Users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: this.registerUserData.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      income: this.registerUserData.income
    };
    console.log(userData);
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    console.log("SIGN OUT FUNCTION RUNNING")
    return this.afAuth.signOut().then(() => {
      console.log("SIGN OUT THEN BLOCK RUNNING")
      localStorage.removeItem('user');
      console.log("Navigating to sign in")
      this.router.navigate(['sign-in']);
    });
  }

}