import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThreeJsSceneComponent } from './home/three-js-scene/three-js-scene.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { WorkComponent } from './work/work.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ThreeJsSceneComponent,
    AboutComponent,
    WorkComponent,
    ContactComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgbModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
