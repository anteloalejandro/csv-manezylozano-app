import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginWarningComponent } from './login-warning/login-warning.component';
import { LogListComponent } from './log-list/log-list.component';
import { PiezasUploadComponent } from './piezas-upload/piezas-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    LoginWarningComponent,
    LogListComponent,
    PiezasUploadComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
