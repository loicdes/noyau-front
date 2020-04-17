import { Component, OnInit, OnDestroy } from '@angular/core';
import { DominosService } from 'src/services/dominos.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarService } from 'src/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { getCookie } from '../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dominos',
  templateUrl: './dominos.component.html',
  styleUrls: ['./dominos.component.scss']
})
export class DominosComponent implements OnInit, OnDestroy {

  players = [];
  spectators = [];
  spinnerMessage;
  maxPlayers = 3;
  board = [];
  hand = [];
  hands = [];
  nextPlayer;
  selectedDomino;
  selectedSlot;
  currentPlayer;
  currentRoom;
  onDestroy$ = new Subject();

  constructor(private dominosService: DominosService, private snackBarService: SnackBarService,
              private spinnerService: NgxSpinnerService) { }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.dominosService.disconnect();
  }

  ngOnInit() {
    this.currentPlayer = getCookie('USER');
    this.currentRoom = getCookie('ROOM');
    this.dominosService.joinGame();
    this.showSpinner();
    this.dominosService.messages.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      this.players = msg.players;
      this.spectators = msg.spectators;
      this.snackBarService.open(msg.news, 'success');
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
    }
  }
  passer() {
    this.dominosService.turnOver(this.board, this.hand);
  }

  swap(domino) {
    const temp = domino.right;
    domino.right = domino.left;
    domino.left = temp;
    return domino;
  }

}
