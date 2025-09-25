import { PlaidLib } from "~/app/plaid/libs/plaid.lib";


export class TransactionFetchResponse {
	public constructor(
		/**
		 * Transactions that have been added to a Source since cursor ordered by
		 * ascending last modified time.
		 */
		public readonly added: PlaidLib.Transaction[],
		/**
		 * Transactions that have been modified on the Source since cursor ordered by
		 * ascending last modified time.
		 */
		public readonly modified: PlaidLib.Transaction[],
		/**
		 * Transactions that have been removed from the Source since cursor ordered by
		 * ascending last modified time.
		 */
		public readonly removed: PlaidLib.RemovedTransaction[],
		/**
		 * Cursor used for fetching any future updates after the latest update
		 * provided in this response. The cursor obtained after all pages have been
		 * pulled (indicated by has_more being false) will be valid for at least 1
		 * year. This cursor should be persisted for later calls. If transactions
		 * are not yet available, this will be an empty string.
		 */
		public readonly transactionCursor: string,
	) {}
}
