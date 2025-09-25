import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import type { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { LoggerFactory } from '../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../log/services/logger/logger.service';
import { LinkComponent } from '../../components/link/link.component';
import { LinkService } from '../../services/link/link.service';
import { PlaidLinkService } from '../../services/plaid-link/plaid-link.service';

@Component({
	selector: 'app-link-page',
	imports: [LinkComponent],
	templateUrl: './link-page.component.html',
	styleUrl: './link-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkPageComponent implements OnInit {
	private readonly logger: Logger;

	public constructor(
		private readonly linkService: LinkService,
		private readonly loggerFactory: LoggerFactory,
		private readonly plaidLink: PlaidLinkService,
	) {
		this.logger = this.loggerFactory.create(this);
	}

	public async ngOnInit() {
		await this.linkService.getPublicToken();

		await this.plaidLink.create(
			this.onSuccess.bind(this),
			this.onLoad.bind(this),
			this.onExit.bind(this),
			this.onEvent.bind(this),
		);

		await this.plaidLink.open();
	}

	private async onSuccess(
		publicToken: string,
		metadata: PlaidLinkOnSuccessMetadata,
	) {
		this.logger.debug('Plaid onSuccess called with public token', publicToken);

		metadata.accounts;

		this.logger.debug('Plaid onSuccess called with metadata', metadata);
		await this.linkService.exchangePublicToken(publicToken, metadata);
	}

	private onLoad() {
		this.logger.debug('Plaid onLoad called');
	}

	private onExit(error: unknown, metadata: unknown) {
		this.logger.error('Plaid onExit called with error:', error);

		this.logger.error('Plaid onExit called with metadata:', metadata);
	}

	private onEvent(eventName: unknown, metadata: unknown) {
		this.logger.info('Plaid onEvent called with eventName:', eventName);

		this.logger.info('Plaid onEvent called with metadata:', metadata);
	}
}
