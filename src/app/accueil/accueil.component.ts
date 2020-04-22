import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie } from '../shared/utils';
import { MatDialog } from '@angular/material';
import { DialogPopupComponent } from '../shared/dialog-popup/dialog-popup.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  user;
  room;
  helpMessage = [
    '- Formez un groupe avec les joueurs sur votre réseau social préféré',
    '- Appelez-vous en vocal ou vidéo pour une meilleure expérience',
    '- Le premier joueur entre un nom de salle au choix et choisit le jeu auquel il veut jouer',
    '- Il partage ensuite le numéro de salle aux autres joueurs qui vont alors le rejoindre',
    '- Ps: N\'oubliez pas vos bouteilles de rhum',
    'L\'abus d\'alcool est dangereux pour la santé, à consommer avec modération ;)',
  ];
  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.user = getCookie('USER');
  }

  navigate(url) {
    document.cookie = `USER=${this.user}; expires=0`;
    document.cookie = `ROOM=${this.room}; expires=0`;
    this.router.navigate([`/${url}`]);
  }

  help() {
    this.dialog.open(DialogPopupComponent, { data: { title: 'Comment jouer ?', message: this.helpMessage } });
  }
}
