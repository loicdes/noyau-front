import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DominosService } from 'src/services/dominos.service';
import { SnackBarService } from 'src/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { getCookie } from '../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ɵangular_packages_router_router_b } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogPopupComponent } from '../shared/dialog-popup/dialog-popup.component';

@Component({
  selector: 'app-dominos',
  templateUrl: './dominos.component.html',
  styleUrls: ['./dominos.component.scss']
})
export class DominosComponent implements OnInit, OnDestroy {

  players = [];
  spinnerMessage;
  maxPlayers = 3;
  board = [];
  hand = [];
  hands = [];
  nextPlayer;
  winner;
  selectedDomino;
  selectedSlot;
  currentPlayer;
  currentRoom;
  onDestroy$ = new Subject();
  @ViewChild('empty1', undefined) empty1: ElementRef<any>;
  @ViewChild('empty2', undefined) empty2: ElementRef<any>;

  helpMessage = [
    '- Lorsque c\'est ton tour, choisis un domino et fais le glisser vers une des zones vides jusqu\'à ce qu\'elle brille',
    '- Sur téléphone, privilégie plutot le clic sur un domino puis sur une zone vide',
    '- Le jeu s\'arrête lorsqu\'un joueur n\'a plus de dominos, vous devez alors quitter puis créer une nouvelle salle',
    '- Si vous êtes tous boudé, quittez puis créez une nouvelle salle',
    'Ps: Je t\'avais dit que c\'est une version bêta...'
  ];

  constructor(private dominosService: DominosService, private snackBarService: SnackBarService,
              private spinnerService: NgxSpinnerService, private cdRef: ChangeDetectorRef,
              private dialog: MatDialog) { }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.dominosService.disconnect();
  }

  ngOnInit() {
    this.cdRef.detectChanges();
    this.currentPlayer = getCookie('USER');
    this.currentRoom = getCookie('ROOM');
    this.dominosService.joinGame();
    this.showSpinner();
    this.dominosService.messages.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      this.players = msg.players;
      if (msg.nextPlayer) {
        this.board = msg.board || this.board;
        this.hand = getCookie('HAND') ? JSON.parse(getCookie('HAND')) : this.hand;
        this.nextPlayer = msg.nextPlayer;
        this.snackBarService.open(`Prochain joueur : ${msg.nextPlayer}`, 'success');
      }
      if (msg.boude) {
        this.dialog.open(DialogPopupComponent, { data: { title: msg.news } });
      } else {
        this.snackBarService.open(msg.news, 'success');
      }
      this.showSpinner();
    });

    this.dominosService.gameUpdates.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      this.selectedDomino = undefined;
      this.selectedSlot = undefined;
      this.board = msg.board;
      if (msg.nextPlayer) {
        this.nextPlayer = msg.nextPlayer;
        this.snackBarService.open(`Prochain joueur : ${msg.nextPlayer}`, 'success');
      }
      if (msg.winner) {
        this.nextPlayer = undefined;
        this.winner = msg.winner;
        this.snackBarService.open(`${msg.winner} a gagné la partie !`, 'success', 10000);
      }
      this.hands = msg.hands;
      this.hand = msg.hands ? msg.hands[getCookie('USER')] : this.hand;
    });
  }

  public get myTurn() {
    return this.nextPlayer === this.currentPlayer;
  }
  showSpinner() {
    if (this.players.length !== this.maxPlayers) {
      this.spinnerMessage = 'En attente de joueurs, prépare ton rhum...';
      this.spinnerService.show();
    } else {
      this.spinnerService.hide();
    }
  }

  play() {
    if (this.selectedDomino && this.selectedSlot && this.myTurn) {
      if (this.board.length === 0) {
        this.board.push(this.selectedDomino);
      } else if (this.selectedSlot === 'end' &&
      (this.selectedDomino.right === this.board[this.board.length - 1].right ||
       this.selectedDomino.left === this.board[this.board.length - 1].right )) {
          if (this.selectedDomino.left !== this.board[this.board.length - 1].right) {
            this.selectedDomino = this.swap(this.selectedDomino);
          }
          this.board.push(this.selectedDomino);
      } else if (this.selectedSlot === 'start' &&
      (this.selectedDomino.right === this.board[0].left ||
       this.selectedDomino.left === this.board[0].left )) {
         if (this.selectedDomino.right !== this.board[0].left) {
           this.selectedDomino = this.swap(this.selectedDomino);
         }
         this.board.unshift(this.selectedDomino);
      } else {
        this.snackBarService.open('Tu ne peux pas jouer ça...', 'error');
        return;
      }
      const indexToRemove = this.hand.findIndex(d => d.left === this.selectedDomino.left && d.right === this.selectedDomino.right);
      this.hand.splice(indexToRemove, 1);
      this.dominosService.turnOver(this.board, this.hand);
      document.cookie = `HAND=${JSON.stringify(this.hand)}; expires=0`;
    }
  }
  passer() {
    this.dominosService.turnOver(this.board, this.hand, true);
  }

  swap(domino) {
    const temp = domino.right;
    domino.right = domino.left;
    domino.left = temp;
    return domino;
  }

  setSelectedSlot(event) {
    if (window.ontouchstart === undefined) {
      return;
    }
    // tslint:disable: no-string-literal
    this.selectedSlot = this.inBound(this.empty1['element'].nativeElement, event) ? 'start' :
                        this.inBound(this.empty2['element'].nativeElement, event) ? 'end' : undefined;
  }
  inBound(element, event) {
    const xBound = element.x - element.width <= event.item.element.nativeElement.x + event.distance.x &&
                   element.x + element.width >= event.item.element.nativeElement.x + event.distance.x;
    const yBound = element.y - element.height <= event.item.element.nativeElement.y + event.distance.y &&
                   element.y >= event.item.element.nativeElement.y + event.distance.y;
    return xBound && yBound;
  }

  help() {
    this.dialog.open(DialogPopupComponent, { data: { title: 'Comment jouer ?', message: this.helpMessage } });
  }
}
