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
        this.socket.emit('PYRAMIDE-JOINED', { user: getCookie('USER'), room: getCookie('ROOM') });
        this.socket.on('PYRAMIDE-JOINED-' + getCookie('ROOM'), message => this.messages.next(message));
        this.socket.on('PYRAMIDE-JOINED-SPECTATOR-' + getCookie('ROOM'), message => this.messages.next(message));
        this.socket.on('PYRAMIDE-START-GAME-' + getCookie('ROOM'), message => this.gameUpdates.next(message));
        this.socket.on('PYRAMIDE-PRELIM-' + getCookie('ROOM'), message => this.prelimUpdates.next(message));
        this.socket.on('PYRAMIDE-SHOW-' + getCookie('ROOM'), message => this.showUpdates.next(message));
        this.socket.on('PYRAMIDE-REVEAL-' + getCookie('ROOM'), message => this.showUpdates.next(message));
    }
    startGame(etages) {
        this.socket.emit('PYRAMIDE-STARTED', { user: getCookie('USER'), room: getCookie('ROOM'), etages });
    }
    turnOver(tour, gameStep) {
        this.socket.emit('PYRAMIDE-TURN-OVER', {player: getCookie('USER'), tour, gameStep, room: getCookie('ROOM') });
    }
    show(card, msg) {
        this.socket.emit('PYRAMIDE-SHOW', {player: getCookie('USER'), card, room: getCookie('ROOM'), msg });
    }
    reveal(card) {
        this.socket.emit('PYRAMIDE-REVEAL', {player: getCookie('USER'), card, room: getCookie('ROOM') });
    }
    disconnect() {
        this.socket.emit('PYRAMIDE-DISCONNECT', {user: getCookie('USER'), room: getCookie('ROOM') });
    }
}
