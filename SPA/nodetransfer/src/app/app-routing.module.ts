import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './path/home/home.component';
import { PanelComponent } from './path/panel/panel.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProfileComponent } from './path/profile/profile.component';
import { UploadComponent } from './path/upload/upload.component';
import { SearchComponent } from './path/search/search.component';
import { UserComponent } from './path/user/user.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: 'auth/register', component: RegisterComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'panel/:id', component: PanelComponent},
      {path: 'panel/:id/profile', component: ProfileComponent},
      {path: 'panel/:id/upload', component: UploadComponent},
      {path: 'panel/:id/search', component: SearchComponent},
      {path: 'panel/:id/user/:user', component: UserComponent},
    ]
  },
  {path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
