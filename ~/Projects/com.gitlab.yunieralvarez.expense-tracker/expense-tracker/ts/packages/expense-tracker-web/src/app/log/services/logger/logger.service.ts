import { LoggerFactory } from '../logger-factory/logger-factory.service';

export class Logger {
	constructor(
		private readonly logger: LoggerFactory,
		private readonly context: string,
	) {}

	public error(...message: Parameters<(typeof console)['error']>) {
		this.logger.error(this.context, ...message);
	}

	public warn(...message: Parameters<(typeof console)['warn']>) {
		this.logger.warn(this.context, ...message);
	}

	public info(...message: Parameters<(typeof console)['info']>) {
		this.logger.info(this.context, ...message);
	}

	public http(...message: Parameters<(typeof console)['log']>) {
		this.logger.http(this.context, ...message);
	}

	public verbose(...message: Parameters<(typeof console)['log']>) {
		this.logger.verbose(this.context, ...message);
	}

	public debug(...message: Parameters<(typeof console)['debug']>) {
		this.logger.debug(this.context, ...message);
	}

	public trace(...message: Parameters<(typeof console)['trace']>) {
		this.logger.trace(this.context, ...message);
	}
}
