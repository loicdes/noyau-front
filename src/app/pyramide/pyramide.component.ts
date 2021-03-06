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
  helpMessage = [
    '- Le premier joueur est maître du jeu',
    '- Il décide du moment où la partie débute, du nombre d\'étages de la pyramide, '
    + 'et sera en charge de retourner les cartes lors de l\'ascension de la pyramide',
    '- Lors de la phase préliminaire, chaque joueur se verra poser des questions (rouge ou noir, ...)' +
    ' et se verra attribuer une carte.',
    '- Si le joueur a bien répondu, il distribue une gorgée, sinon il boit. Tu connais le jeu...',
    '- Lors de l\'ascension de la pyramide, le maître du jeu va retourner des cartes',
    '- Vous allez alors dire à qui vous faites boire, la suite tu connais...',
    'Ps: Si vous n\'êtes pas assez boulé, vous pouvez quitter puis recréer une salle pour recommencer.'
  ];
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
        this.snackBarService.open('Les cartes vont se retourner dans 30sec, ' +
                                  'vous pouvez les replacer dans l\'ordre désiré', 'success', 30000);
        setTimeout(() => this.gameStatus = GAME_STEPS.ASCENDING, 30000);
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
          this.dialog.afterClosed().subscribe(() => {
            this.hand.push(this._hand[msg.tour]);
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
      this.dialog = this.matDialog.open(DialogPopupComponent, {
        data: {
          img: {
            name: card.value + '_' + card.sign
          },
          title: 'Je montre à tout le monde'
        }
      });
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

  help() {
    this.matDialog.open(DialogPopupComponent, { data: { title: 'Comment jouer ?', message: this.helpMessage } });
  }
}
