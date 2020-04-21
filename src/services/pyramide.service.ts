import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { getCookie } from 'src/app/shared/utils';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PyramideService {
    private url = environment.API_ROUTE;
    private socket;
    public messages = new Subject<any>();
    public gameUpdates = new Subject<any>();
    public prelimUpdates = new Subject<any>();
    public showUpdates = new Subject<any>();
    currentUser = getCookie('USER');
    currentRoom = getCookie('ROOM');

    constructor() {
        this.socket = io(this.url);
    }
    joinGame() {
        this.socket.emit('PYRAMIDE-JOINED', { user: this.currentUser, room: this.currentRoom });
        this.socket.on('PYRAMIDE-JOINED-' + this.currentRoom, message => this.messages.next(message));
        this.socket.on('PYRAMIDE-JOINED-SPECTATOR-' + this.currentRoom, message => this.messages.next(message));
        this.socket.on('PYRAMIDE-START-GAME-' + this.currentRoom, message => this.gameUpdates.next(message));
        this.socket.on('PYRAMIDE-PRELIM-' + this.currentRoom, message => this.prelimUpdates.next(message));
        this.socket.on('PYRAMIDE-SHOW-' + this.currentRoom, message => this.showUpdates.next(message));
        this.socket.on('PYRAMIDE-REVEAL-' + this.currentRoom, message => this.showUpdates.next(message));
    }
    startGame(etages) {
        this.socket.emit('PYRAMIDE-STARTED', { user: this.currentUser, room: this.currentRoom, etages });
    }
    turnOver(tour, gameStep) {
        this.socket.emit('PYRAMIDE-TURN-OVER', {player: this.currentUser, tour, gameStep, room: this.currentRoom });
    }
    show(card, msg) {
        this.socket.emit('PYRAMIDE-SHOW', {player: this.currentUser, card, room: this.currentRoom, msg });
    }
    reveal(card) {
        this.socket.emit('PYRAMIDE-REVEAL', {player: this.currentUser, card, room: this.currentRoom });
    }
    disconnect() {
        this.socket.emit('PYRAMIDE-DISCONNECT', {user: this.currentUser, room: this.currentRoom });
    }
}
