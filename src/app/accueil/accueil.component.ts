import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie } from '../shared/utils';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  user;
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = getCookie('USER');
  }

  navigate(url) {
    document.cookie = `USER=${this.user}; expires=0`;
    this.router.navigate([`/${url}`]);
  }

}
