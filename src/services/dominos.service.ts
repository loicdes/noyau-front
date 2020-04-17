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
    currentUser = getCookie('USER');
    currentRoom = getCookie('ROOM');

    constructor() {
        this.socket = io(this.url);
    }
    joinGame() {
        this.socket.emit('DOMINOS-STARTED', { user: this.currentUser, room: this.currentRoom });
        this.socket.on('DOMINOS-JOINED-' + this.currentRoom, message => this.messages.next(message));
        this.socket.on('DOMINOS-JOINED-SPECTATOR-' + this.currentRoom, message => this.messages.next(message));
        this.socket.on('DOMINOS-START-GAME-' + this.currentRoom, message => this.gameUpdates.next(message));
        this.socket.on('DOMINOS-NEXT-PLAYER-' + this.currentRoom, message => this.gameUpdates.next(message));
        this.socket.on('DOMINOS-GAME-OVER-' + this.currentRoom, message => this.gameUpdates.next(message));
        this.socket.on('DOMINOS-GAME-OVER-' + this.currentRoom, message => this.gameUpdates.next(message));
    }
    turnOver(board, hand) {
        this.socket.emit('DOMINOS-TURN-OVER', {player: this.currentUser, board, hand, room: this.currentRoom });
    }
    disconnect() {
        this.socket.emit('DOMINOS-DISCONNECT', {user: this.currentUser, room: this.currentRoom });
    }
}
