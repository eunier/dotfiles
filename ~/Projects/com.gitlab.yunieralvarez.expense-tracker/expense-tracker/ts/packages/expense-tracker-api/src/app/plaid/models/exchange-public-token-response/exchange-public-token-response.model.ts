import { PlaidLib } from '~/app/plaid/libs/plaid.lib';

/** {@link ItemPublicTokenExchangeResponse} */
export class ExchangePublicTokenResponse {
	public constructor(
		/**
		 * The access token retrieved from the {@link ItemPublicTokenExchangeResponse}.
		 */
		public readonly accessToken: PlaidLib.ItemPublicTokenExchangeResponse['access_token'],

		/**
		 * The source id (item_id) retrieved from the {@link PlaidLib.ItemPublicTokenExchangeResponse}.
		 */
		public readonly plaidId: PlaidLib.ItemPublicTokenExchangeResponse['item_id'],

		/**
		 * The request ID retrieved from the {@link PlaidLib.ItemPublicTokenExchangeResponse}.
		 */
		public readonly requestId: PlaidLib.ItemPublicTokenExchangeResponse['request_id'],
	) {}

	public static fromPlaidItemPublicTokenExchangeResponse(
		response: PlaidLib.ItemPublicTokenExchangeResponse,
	) {
		return new ExchangePublicTokenResponse(
			response.access_token,
			response.item_id,
			response.request_id,
		);
	}
}
