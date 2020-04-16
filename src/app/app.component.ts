import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  init = false;
  constructor(private spinnerService: NgxSpinnerService, private http: HttpService) {
    this.spinnerService.show();
    this.http.init().subscribe( () => {
      this.init = true;
      this.spinnerService.hide();
    });
  }
}
