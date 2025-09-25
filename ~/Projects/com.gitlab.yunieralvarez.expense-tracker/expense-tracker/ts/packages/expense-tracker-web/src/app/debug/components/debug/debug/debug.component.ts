import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoggerFactory } from '../../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../../log/services/logger/logger.service';
import { DebugService } from '../../../services/debug/debug.service';

@Component({
	selector: 'app-debug',
	imports: [MatButtonModule],
	templateUrl: './debug.component.html',
	styleUrl: './debug.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebugComponent {
	public readonly logger: Logger;

	constructor(
		private readonly loggerFactory: LoggerFactory,
		private readonly service: DebugService,
	) {
		this.logger = this.loggerFactory.create(this);
	}

	public async callSecureApiEndpoint() {
		this.logger.debug('Calling secured api endpoint');

		try {
			await this.service.secure();
			this.logger.debug('Secured api endpoint called successfully');
		} catch (error) {
			this.logger.error('Error calling secured api endpoint', error);
		}
	}
}
