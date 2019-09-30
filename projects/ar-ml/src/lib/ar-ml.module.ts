import { NgModule } from '@angular/core';
import { ArMlComponent } from './ar-ml.component';
import {CommonModule } from '@angular/common'


@NgModule({
  declarations: [ArMlComponent],
  imports: [
    CommonModule
  ],
  exports: [ArMlComponent]
})
export class ArMlModule { }
