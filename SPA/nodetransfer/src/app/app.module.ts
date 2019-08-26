import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './layout/nav/nav.component';
import { HomeComponent } from './path/home/home.component';
import { PanelComponent } from './path/panel/panel.component';
import { ProfileComponent } from './path/profile/profile.component';
import { UploadComponent } from './path/upload/upload.component';
import { SearchComponent } from './path/search/search.component';
// SERVICES & GUARDS
import { AuthService } from './_services/auth.service';
import { AlertifyService } from './_services/alertify.service';
import { AuthGuard } from './_guards/auth.guard';
import { ApiService } from './_services/api.service';
// PRIMENG
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { DataViewModule } from 'primeng/dataview';
import { UserComponent } from './path/user/user.component';

export function tokenGet() {
  return localStorage.getItem('token');
}
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavComponent,
    HomeComponent,
    PanelComponent,
    ProfileComponent,
    UploadComponent,
    SearchComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        headerName: 'Authorization',
        authScheme: '',
        whitelistedDomains: ['192.168.1.3:3000', 'localhost:3000', 'api.nodetransfer.com'],
        tokenGetter: tokenGet
      }
    }),
    FormsModule,
    // PRIMENG
    TableModule,
    FileUploadModule,
    DataViewModule

  ],

  providers: [
    AuthService,
    AlertifyService,
    ApiService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
