import { Component, OnInit } from '@angular/core';
import { DominosService } from 'src/services/dominos.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarService } from 'src/services/snackbar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { getCookie } from '../shared/utils';

@Component({
  selector: 'app-dominos',
  templateUrl: './dominos.component.html',
  styleUrls: ['./dominos.component.scss']
})
export class DominosComponent implements OnInit {

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

  constructor(private dominosService: DominosService, private snackBarService: SnackBarService,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.currentPlayer = getCookie('USER');
    this.dominosService.joinGame();
    this.showSpinner();
    this.dominosService.messages.subscribe(msg => {
      this.players = msg.players;
      this.spectators = msg.spectators;
      this.snackBarService.open(msg.news, 'success');
      this.showSpinner();
    });

    this.dominosService.gameUpdates.subscribe(msg => {
      this.selectedDomino = undefined;
      this.selectedSlot = undefined;
      this.board = msg.board;
      this.nextPlayer = msg.nextPlayer;
      this.snackBarService.open(`Next player : ${msg.nextPlayer}`, 'success');
      this.hands = msg.hands;
      this.hand = msg.hands ? msg.hands[getCookie('USER')] : this.hand;
    });
  }

  public get myTurn() {
    return this.nextPlayer === this.currentPlayer;
  }
  showSpinner() {
    if (this.players.length !== this.maxPlayers) {
      this.spinnerMessage = 'Waiting for niggas';
      this.spinnerService.show();
    } else {
      this.spinnerService.hide();
    }
  }

  play() {
    if (this.selectedDomino && this.selectedSlot && this.nextPlayer === getCookie('USER')) {
      if (this.board.length === 0) {
        this.board.push(this.selectedDomino);
      } else if (this.selectedSlot === 'end' &&
      (this.selectedDomino.right === this.board[0].right || this.selectedDomino.left === this.board[0].left )) {
        this.board.push(this.selectedDomino);
      } else if (this.selectedSlot === 'start' &&
      (this.selectedDomino.right === this.board[this.board.length - 1].right ||
        this.selectedDomino.left === this.board[this.board.length - 1].left )) {
        this.board.unshift(this.selectedDomino);
      } else {
        this.snackBarService.open('Tu ne peux pas jouer ça...', 'error');
        return;
      }
      const indexToRemove = this.hand.findIndex(d => d.left === this.selectedDomino.left && d.right === this.selectedDomino.right);
      this.hand.splice(indexToRemove, 1);
      this.dominosService.turnOver(this.board);
    }
  }
  passer() {
    this.dominosService.turnOver(this.board);
  }

}
