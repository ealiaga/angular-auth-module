import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    user: User;
    USER_TOKEN = 'user';

    fallbackUrl = '';

    get isLoggedIn(): boolean {
        return !!this.user;
    }

    constructor(
        private http: HttpClient,
        private storage: StorageService
    ) { }

    setUser(userData: User) {
        this.user = userData;
        this.storage.setItem(this.USER_TOKEN, this.user);
    }

    getUser() {
        return this.storage.getItem(this.USER_TOKEN) || this.user;
    }

    authenticate(email: string, password: string): Observable<boolean> {
        return this.http.post<User>(environment.endpoint.auth, {
            email, password
        }).pipe(
                map(userData => {
                    this.setUser(userData);
                    return this.isLoggedIn;
                })
            );
    }
}
