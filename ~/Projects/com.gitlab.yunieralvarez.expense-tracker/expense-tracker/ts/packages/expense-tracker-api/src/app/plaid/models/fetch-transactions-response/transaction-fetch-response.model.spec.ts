import { TransactionFetchResponse } from './transaction-fetch-response.model';

describe('FetchTransactionsResponse', () => {
	it('should be defined', () => {
		expect(new TransactionFetchResponse([], [], [], '')).toBeDefined();
	});
});
