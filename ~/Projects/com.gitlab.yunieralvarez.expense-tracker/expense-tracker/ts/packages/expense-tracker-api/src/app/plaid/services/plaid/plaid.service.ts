import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Config } from '~/app/config/services/config/config.service';
import { PlaidLib } from '~/app/plaid/libs/plaid.lib';
import { ExchangePublicTokenResponse } from '~/app/plaid/models/exchange-public-token-response/exchange-public-token-response.model';
import { TransactionFetchResponse } from '~/app/plaid/models/fetch-transactions-response/transaction-fetch-response.model';
import { PLAID_API_CLASS_TOKEN } from '~/app/plaid/providers/plaid-api-class.provider';

@Injectable()
export class PlaidService {
	private readonly logger = new Logger(PlaidService.name);
	private readonly configuration: PlaidLib.Configuration;
	private readonly plaidClient: PlaidLib.PlaidApi;

	public constructor(
		@Inject(PLAID_API_CLASS_TOKEN)
		private readonly plaidApiClass: typeof PlaidLib.PlaidApi,
		private readonly config: Config,
	) {
		this.configuration = new PlaidLib.Configuration({
			basePath: PlaidLib.PlaidEnvironments.sandbox,
			baseOptions: {
				headers: {
					'PLAID-CLIENT-ID': this.config.plaid.clientId,
					'PLAID-SECRET': this.config.plaid.secret,
					'Plaid-Version': this.config.plaid.version,
				},
			},
		});

		this.plaidClient = new this.plaidApiClass(this.configuration);
	}

	/**
	 * Crate a Plaid link token.
	 * @param userId The user id.
	 * @returns The Plaid link token.
	 */
	public async createLinkToken(userId: string) {
		const request: PlaidLib.LinkTokenCreateRequest = {
			client_name: this.config.app.plaidClientName,
			country_codes: this.config.plaid.countryCodes,
			language: 'en',
			products: this.config.plaid.products,
			user: { client_user_id: userId },
		};

		const linkTokenResponse: AxiosResponse<
			PlaidLib.LinkTokenCreateResponse,
			unknown
		> = await this.plaidClient.linkTokenCreate(request);

		return linkTokenResponse.data;
	}

	/**
	 * Exchange a Plaid public token for a Plaid access token.
	 * @param publicToken Plaid public token.
	 * @returns Plaid access token.
	 */
	public async exchangePublicToken(publicToken: string) {
		const request: PlaidLib.ItemPublicTokenExchangeRequest = {
			public_token: publicToken,
		};

		const plaidResponse =
			await this.plaidClient.itemPublicTokenExchange(request);

		const response =
			ExchangePublicTokenResponse.fromPlaidItemPublicTokenExchangeResponse(
				plaidResponse.data,
			);

		return response;
	}

	/**
	 * Get an institution by id.
	 * @param institutionId The institution id.
	 * @returns The institution
	 */
	public async getInstitutionById(institutionId: string) {
		const req: PlaidLib.InstitutionsGetByIdRequest = {
			institution_id: institutionId,
			country_codes: this.config.plaid.countryCodes,
		};

		const res = await this.plaidClient.institutionsGetById(req);
		return res.data;
	}

	/**
	 * Fetch transactions.
	 * @param sourceAccessToken The access token for the source.
	 * @param cursor The next transaction cursor.
	 * @returns Fetched transactions.
	 */
	public async fetchTransactions(sourceAccessToken: string, cursor = '') {
		let added: PlaidLib.Transaction[] = [];
		let modified: PlaidLib.Transaction[] = [];
		let removed: PlaidLib.RemovedTransaction[] = [];
		let nextCursor = cursor;
		let hasMore = false;
		const count = this.config.app.plaidTransactionSyncCount;

		do {
			const res = await this.plaidClient.transactionsSync({
				access_token: sourceAccessToken,
				count,
				cursor: nextCursor,
				options: { include_original_description: true },
			});

			added = added.concat(res.data.added);
			modified = modified.concat(res.data.modified);
			removed = removed.concat(res.data.removed);
			nextCursor = res.data.next_cursor;
			hasMore = res.data.has_more;

			this.logger.log(
				`Received ${res.data.added.length} added, ${res.data.modified.length} modified, and ${res.data.removed.length} removed transaction(s)`,
			);

			this.logger.log(
				`Transaction sync response ${res.data.has_more ? 'had more' : 'does not have more'} transaction(s)`,
			);
		} while (hasMore);

		this.logger.log(
			`Received a total of ${added.length} added, ${modified.length} modified, and ${removed.length} removed transaction(s)`,
		);

		return new TransactionFetchResponse(added, modified, removed, nextCursor);
	}
}
