import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardExampleComponent } from './components/card-example/card-example.component';
import { ArMlModule } from 'ar-ml'

@NgModule({
  declarations: [
    AppComponent,
    CardExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ArMlModule
  ],
  entryComponents: [ CardExampleComponent ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
