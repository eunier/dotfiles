import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '../../../http/services/http/http.service';
import { LoggerFactory } from '../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../log/services/logger/logger.service';
import { LocalStorageKey } from '../../../storage/enums/local-storage-key.enum';
import { LocalStorageService } from '../../../storage/services/local-storage/local-storage/local-storage.service';
import { LoginReqDto } from '../../dto/login-req.dto';
import { LoginResDto } from '../../dto/login-res.dto';
import { RefreshReqDto } from '../../dto/refresh-req.dto';
import { RefreshResDto } from '../../dto/refresh-res.dto';
import { RegisterDto } from '../../dto/register.dto';
import { Token } from '../../enums/token.enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly logger: Logger;
	constructor(
		private readonly http: Http,
		private readonly localStorage: LocalStorageService,
		private readonly loggerFactory: LoggerFactory,
		private readonly router: Router,
	) {
		this.logger = this.loggerFactory.create(this);
	}

	public async register(dto: RegisterDto) {
		return await this.http.post('auth/register', dto);
	}

	public async login(dto: LoginReqDto) {
		const res = await this.http.post<LoginResDto>('auth/login', dto);
		this.saveTokens(res);
		return res;
	}

	public async refresh(dto: RefreshReqDto) {
		const res = await this.http.post<RefreshResDto>('auth/refresh', dto);
		this.saveTokens(res);
		return res;
	}

	public getToken(token: Token) {
		return this.localStorage.getItem(
			token as unknown as
				| LocalStorageKey.AccessToken
				| LocalStorageKey.RefreshToken,
		);
	}

	public isTokenExpired(token: Token) {
		const tokenVal = this.getToken(token);

		if (!tokenVal) return true;

		const payload = JSON.parse(atob(tokenVal.split('.')[1])) as {
			exp: number;
		};

		const expirationTime = payload.exp * 1000;
		return Date.now() > expirationTime - 1 * 60 * 1000;
	}

	public logout() {
		this.logger.info('Logging out...');
		this.localStorage.removeItem(LocalStorageKey.AccessToken);
		this.localStorage.removeItem(LocalStorageKey.RefreshToken);
		this.router.navigate(['auth/login']);
	}

	private saveTokens(tokens: LoginResDto | RefreshResDto) {
		this.localStorage.setItem(LocalStorageKey.AccessToken, tokens.accessToken);

		this.localStorage.setItem(
			LocalStorageKey.RefreshToken,
			tokens.refreshToken,
		);
	}
}
