import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from './alert.dto';

@Component({
  selector: 'core-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() alert: Alert;
  @Output() remove = new EventEmitter<Alert>();
  constructor() { }
  
  ngOnInit(): void {
  }


  Remove() {
    this.remove.emit(this.alert);
  }

}
