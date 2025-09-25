import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Config } from '../../../config/services/config/config.service';
import { HttpResponseDto } from '../../dto/http-response.dto';

@Injectable({
	providedIn: 'root',
})
export class Http {
	constructor(
		private readonly config: Config,
		private readonly http: HttpClient,
	) {}

	public async post<T = null>(...args: Parameters<HttpClient['post']>) {
		return (await lastValueFrom(
			this.http
				.post(...this.prepareRequestArgs(...args))
				.pipe(map((res) => (res as HttpResponseDto<T>).data)),
		)) as Promise<T>;
	}

	public async get<T = null>(...args: Parameters<HttpClient['get']>) {
		return (await lastValueFrom(
			this.http
				.get(...this.prepareRequestArgs(...args))
				.pipe(map((res) => (res as HttpResponseDto<T>).data)),
		)) as Promise<T>;
	}

	private prepareRequestArgs<
		TParameters extends Parameters<HttpClient['get'] | HttpClient['post']>,
	>(...args: TParameters) {
		let [url, ...rest] = args;
		url = `${this.config.api}/${url}`;
		return [url, ...rest] as TParameters;
	}
}
