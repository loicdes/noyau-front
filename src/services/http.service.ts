import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { getCookie } from 'src/app/shared/utils';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) { }
    private url = environment.API_ROUTE;

    init() {
        return this.http.get(this.url);
    }
}
