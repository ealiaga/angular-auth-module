import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private serializedKeys = [];

    constructor() {
        this.serializedKeys.push(
            'user'
        );
    }

    setItem(token: string, value: Object | string) {
        if (value instanceof Object) {
            localStorage.setItem(token, JSON.stringify(value));
            // Legacy code: Store each key at first Level I don't know why
            Object.keys(value)
                .forEach(key => {
                    let valueToStore = value[key];
                    if (valueToStore instanceof Object) {
                        valueToStore = JSON.stringify(valueToStore);
                    }
                    localStorage.setItem(`${token}-${key}`, valueToStore);
                });
        } else {
            localStorage.setItem(token, value);
        }
    }

    getItem(key: string): any {
        const storedValue = localStorage.getItem(key);
        if (this.serializedKeys.includes(key)) {
            return JSON.parse(storedValue);
        }
        return localStorage.getItem(key);
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

}
