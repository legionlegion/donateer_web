import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MissionComponent } from './components/mission/mission.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RegisterIncomeComponent } from './components/register-income/register-income.component';
import { PaymentComponent } from './components/payment/payment.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { DonateComponent } from './components/donate/donate.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'donate', component: DonateComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent},
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'register-income', component: RegisterIncomeComponent},
  { path: 'mission', component: MissionComponent},
  { path: 'payment', component: PaymentComponent},
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}