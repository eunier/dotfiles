import { Injectable } from '@angular/core';
import { Config } from '../../../config/services/config/config.service';
import { LogLevel } from '../../enums/log-level.enum';
import { Logger } from '../logger/logger.service';

@Injectable({
	providedIn: 'root',
})
export class LoggerFactory {
	private readonly logLevel: LogLevel;

	constructor(private config: Config) {
		this.logLevel = this.config.logLevel;
	}

	public create(context: object): Logger {
		return new Logger(this, context.constructor.name);
	}

	public error(
		location: string,
		...message: Parameters<(typeof console)['error']>
	) {
		this.attemptToLog(LogLevel.Error, console.error, location, ...message);
	}

	public warn(
		location: string,
		...message: Parameters<(typeof console)['warn']>
	) {
		this.attemptToLog(LogLevel.Warn, console.warn, location, ...message);
	}

	public info(
		location: string,
		...message: Parameters<(typeof console)['info']>
	) {
		this.attemptToLog(LogLevel.Info, console.info, location, ...message);
	}

	public http(
		location: string,
		...message: Parameters<(typeof console)['log']>
	) {
		this.attemptToLog(LogLevel.Http, console.log, location, ...message);
	}

	public verbose(
		location: string,
		...message: Parameters<(typeof console)['log']>
	) {
		this.attemptToLog(LogLevel.Verbose, console.log, location, ...message);
	}

	public debug(
		location: string,
		...message: Parameters<(typeof console)['debug']>
	) {
		this.attemptToLog(LogLevel.Debug, console.info, location, ...message);
	}

	public trace(
		location: string,
		...message: Parameters<(typeof console)['trace']>
	) {
		this.attemptToLog(LogLevel.Trace, console.trace, location, ...message);
	}

	private attemptToLog(
		targetLevel: LogLevel,
		logFn: (...args: unknown[]) => unknown,
		location: string,
		...message: unknown[]
	) {
		if (this.logLevel >= targetLevel) {
			const loc = location.startsWith('_') ? location.slice(1) : location;

			logFn(
				`[${this.getLogLevelString(targetLevel).toUpperCase()}]`,
				`[${loc}]`,
				...message,
			);
		}
	}

	private getLogLevelString(logLevel: LogLevel) {
		switch (logLevel) {
			case LogLevel.Error:
				return 'Error';

			case LogLevel.Warn:
				return 'Warn';

			case LogLevel.Info:
				return 'Info';

			case LogLevel.Http:
				return 'Http';

			case LogLevel.Verbose:
				return 'Verbose';

			case LogLevel.Debug:
				return 'Debug';

			case LogLevel.Trace:
				return 'Trace';
		}
	}
}
