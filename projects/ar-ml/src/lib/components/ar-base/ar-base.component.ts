import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AnimationType } from '../../enums/animation-enum';

@Component({
  selector: 'ar-base',
  templateUrl: './ar-base.component.html',
  styleUrls: ['./ar-base.component.css']
})
export class ArBaseComponent implements OnInit {

  @ViewChild("content", {static: false})private content : ElementRef

  isContentVisible = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.checkContentVisibility();
  }

  toggleAnimation(){
    this.isContentVisible = !this.isContentVisible;
    this.checkContentVisibility();
  }

  private checkContentVisibility(){
    if(!this.isContentVisible){
      this.content.nativeElement.className = AnimationType.CLOSE;
    }else{
      this.content.nativeElement.className = AnimationType.OPEN;
    }
  }
}
