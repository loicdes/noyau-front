import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie } from '../shared/utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  user;
  room;
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = getCookie('USER');
  }

  navigate(url) {
    document.cookie = `USER=${this.user}; expires=0`;
    document.cookie = `ROOM=${this.room}; expires=0`;
    this.router.navigate([`/${url}`]);
  }

}
