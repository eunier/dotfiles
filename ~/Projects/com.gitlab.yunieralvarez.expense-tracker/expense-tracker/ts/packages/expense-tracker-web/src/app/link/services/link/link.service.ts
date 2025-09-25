import { Injectable, signal } from '@angular/core';
import { type PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { Http } from '../../../http/services/http/http.service';
import { ExchangePublicTokenRequestDto } from '../../dto/exchange-public-token-request/exchange-public-token-request.dto';
import { LinkTokenDto } from '../../dto/link-token.dto';

@Injectable({
	providedIn: 'root',
})
export class LinkService {
	public readonly linkToken = signal('');

	constructor(private readonly http: Http) {}

	public async getPublicToken() {
		const res = await this.http.get<LinkTokenDto>('link/token');
		this.linkToken.set(res.linkToken);
	}

	public async exchangePublicToken(
		publicToken: string,
		metadata: PlaidLinkOnSuccessMetadata,
	) {
		const dto = ExchangePublicTokenRequestDto.fromPlaidLinkOnSuccessCallback(
			publicToken,
			metadata,
		);

		const res = this.http.post<void>('link/token/public/exchange', dto);
	}
}
