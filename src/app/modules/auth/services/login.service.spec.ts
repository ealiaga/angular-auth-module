import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { LoginService } from './login.service';
import { StorageService } from './storage.service';

class HttpClientMock {
    get = jasmine.createSpy('httpClient.get');
    post = jasmine.createSpy('httpClient.post');
}
class StorageServiceMock {
    setItem = jasmine.createSpy('storageService.setItem');
    getItem = jasmine.createSpy('storageService.getItem');
}

describe('LoginService', () => {
    let service: LoginService;
    let storageServiceMock: StorageServiceMock;
    let httpClientMock: HttpClientMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LoginService,
                {
                    provide: HttpClient,
                    useClass: HttpClientMock
                },
                {
                    provide: StorageService,
                    useClass: StorageServiceMock
                }
            ]
        });
        service = TestBed.get(LoginService);
        storageServiceMock = TestBed.get(StorageService);
        httpClientMock = TestBed.get(HttpClient);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set user in localStorage using storageService setItem method', () => {
        const userToken = service.USER_TOKEN;
        const userData: User = {
            name: 'John Snow',
            email: 'john@stark.com',
            password: 'WinterIsCOMING!',
            group: 'A'
        };
        expect(service.getUser()).toBeUndefined();

        service.setUser(userData);
        const user = service.getUser();
        expect(user).toEqual(userData);
        expect(storageServiceMock.setItem).toHaveBeenCalledWith(userToken, user);
    });

    it('should returns user from storage service or returns the user attribute', () => {
        const userDataFromStorage: User = {
            name: 'Tyrion Lannister',
            email: 'tyrion@lannister.com',
            password: 'HearMeROAR!',
            group: 'B'
        };
        storageServiceMock.getItem.and.returnValue(userDataFromStorage);
        expect(service.getUser()).toEqual(userDataFromStorage);

        storageServiceMock.getItem.and.returnValue(null);
        const anotherUser: User = {
            name: 'Daenerys Targaryen',
            email: 'daenerys@targaryen.com',
            password: 'FireAndBLOOD!',
            group: 'Y'
        };
        service.setUser(anotherUser);
        expect(service.getUser()).toEqual(anotherUser);
    });

    it('should returns an Observable with login status and set the user using http post response', () => {
        const userDataFromServer: User = {
            name: 'Samwell Tarly',
            email: 'sam@tarly.com',
            password: 'FirstINBattle',
            group: 'A'
        };
        const userObservable: Observable<User> = of(userDataFromServer);
        httpClientMock.post.and.returnValue(userObservable);

        const authData = {
            email: 'sam@tarly.com',
            password: 'FirstINBattle'
        };
        service.authenticate(authData.email, authData.password)
            .subscribe(loginStatus => {
                expect(httpClientMock.post)
                    .toHaveBeenCalledWith(environment.endpoint.auth, authData);
                expect(loginStatus).toBe(true);
            });
    });

});
