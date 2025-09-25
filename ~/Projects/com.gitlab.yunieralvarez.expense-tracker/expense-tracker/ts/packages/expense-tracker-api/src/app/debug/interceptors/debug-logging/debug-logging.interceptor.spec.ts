import { DebugLoggingInterceptor } from '~/app/debug/interceptors/debug-logging/debug-logging.interceptor';

describe('DebugLoggingInterceptor', () => {
	it('should be defined', () => {
		expect(new DebugLoggingInterceptor()).toBeDefined();
	});
});
