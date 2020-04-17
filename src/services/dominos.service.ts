import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { getCookie } from 'src/app/shared/utils';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DominosService {
    private url = environment.API_ROUTE;
    private socket;
    public messages = new Subject<any>();
    public gameUpdates = new Subject<any>();

    constructor() {
        this.socket = io(this.url);
    }
    joinGame() {
        this.socket.emit('DOMINOS-STARTED', getCookie('USER'));
        this.socket.on('DOMINOS-JOINED', message => this.messages.next(message));
        this.socket.on('DOMINOS-JOINED-SPECTATOR', message => this.messages.next(message));
        this.socket.on('DOMINOS-START-GAME', message => this.gameUpdates.next(message));
        this.socket.on('DOMINOS-NEXT-PLAYER', message => this.gameUpdates.next(message));
        this.socket.on('DOMINOS-GAME-OVER', message => this.gameUpdates.next(message));
    }
    turnOver(board, hand) {
        this.socket.emit('DOMINOS-TURN-OVER', {player: getCookie('USER'), board, hand });
    }
}
