import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../../../enums/local-storage-key.enum';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
	public setItem(key: LocalStorageKey, value: string) {
		localStorage.setItem(key, value);
	}

	public getItem(key: LocalStorageKey) {
		return localStorage.getItem(key);
	}

	public removeItem(key: LocalStorageKey) {
		localStorage.removeItem(key);
	}
}
