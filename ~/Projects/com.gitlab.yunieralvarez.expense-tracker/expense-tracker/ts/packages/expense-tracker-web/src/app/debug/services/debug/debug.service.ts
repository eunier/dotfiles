import { Injectable } from '@angular/core';
import { Http } from '../../../http/services/http/http.service';

@Injectable({
	providedIn: 'root',
})
export class DebugService {
	constructor(private readonly http: Http) {}

	public async secure() {
		return await this.http.get('debug/secured');
	}
}
