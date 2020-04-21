import { Component, OnInit, OnDestroy } from '@angular/core';
import { getCookie } from '../shared/utils';
import { PyramideService } from 'src/services/pyramide.service';
import { Subject } from 'rxjs';
import { SnackBarService } from 'src/services/snackbar.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { DialogPopupComponent } from '../shared/dialog-popup/dialog-popup.component';

enum GAME_STEPS {
  NOT_STARTED = 0,
  PRELIM = 1,
  ASCENDING = 2,
  END = 3
}
const ACTIONS_PRELIM = {
  0: ['Rouge', 'Noir'],
  1: ['Petit', 'Grand'],
  2: ['Intérieur', 'Extérieur'],
  3: ['Carreau', 'Treffle', 'Coeur', 'Pique']
};

@Component({
  selector: 'app-pyramide',
  templateUrl: './pyramide.component.html',
  styleUrls: ['./pyramide.component.scss']
})
export class PyramideComponent implements OnInit, OnDestroy {

  currentRoom;
  currentUser;
  players = [];
  board = [];
  hand = [];
  _hand = [];
  etages = 0;
  dialog;
  onDestroy$ = new Subject();
  showedCards = [];
  gameStatus  = GAME_STEPS.NOT_STARTED;
  constructor(private snackBarService: SnackBarService, private pyramideService: PyramideService,
              private matDialog: MatDialog) { }


  ngOnDestroy() {
    this.onDestroy$.next();
    this.pyramideService.disconnect();
  }

  public get canEdit() {
    return this.currentUser === this.players[0] && this.gameStatus === GAME_STEPS.NOT_STARTED;
  }

  ngOnInit() {
    this.currentRoom = getCookie('ROOM');
    this.currentUser = getCookie('USER');
    this.pyramideService.joinGame();
    this.pyramideService.messages.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      this.players = msg.players;
      this.snackBarService.open(msg.news, 'success');
    });

    this.pyramideService.gameUpdates.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      this.board = msg.board || this.board;
      this._hand = msg.hands ? msg.hands[this.currentUser] : this._hand;
    });

    this.pyramideService.prelimUpdates.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      if (msg.gameStep === GAME_STEPS.ASCENDING) {
        this.snackBarService.open('Les cartes vont se retourner dans 15sec, ' +
                                  'vous pouvez les replacer dans l\ordre désiré', 'success', 15000);
        setTimeout(() => this.gameStatus = GAME_STEPS.ASCENDING, 15000);
        return;
      }
      if (this.currentUser === msg.nextPlayer) {
          this.gameStatus = msg.gameStep;
          this.dialog = this.matDialog.open(DialogPopupComponent, {
            data: {
              buttons: ACTIONS_PRELIM[msg.tour],
              title: msg.question
            },
            disableClose: true
          });
          this.dialog.afterClosed().subscribe((value) => {
            this.hand.push(this._hand[msg.tour]);
            this.pyramideService.show(this._hand[msg.tour], 'et a joué ' + value);
            this.pyramideService.turnOver(msg.tour, msg.gameStep);
          });
      }
    });

    this.pyramideService.showUpdates.pipe(takeUntil(this.onDestroy$)).subscribe(msg => {
      if (msg.cardToReveal) {
        this.showedCards.push(msg.cardToReveal);
        return;
      }
      if (this._hand.some( c => c.value === msg.card.value && c.sign === msg.card.sign)) {
        return;
      }
      this.dialog = this.matDialog.open(DialogPopupComponent, {
        data: {
          img: {
            name: msg.card.value + '_' + msg.card.sign
          },
          title: msg.news
        }
      });
    });
  }

  startGame() {
    this.pyramideService.startGame(this.etages);
  }

  show(card, hand?) {
    if (this.gameStatus !== GAME_STEPS.ASCENDING && this.gameStatus !== GAME_STEPS.END ) {
      return;
    }
    if (hand) {
      this.pyramideService.show(card, 'de sa main');
    } else {
      this.pyramideService.reveal(card);
    }
  }

  getImageUrl(card, hand?) {
    return (this.gameStatus === GAME_STEPS.PRELIM && hand) ||
            this.showedCards.find(c => c.value === card.value && c.sign === card.sign) ?
            `assets/img_cartes/${card.value}_${ card.sign }.png` :
            'assets/img_cartes/dos-bleu.png';
  }
}
