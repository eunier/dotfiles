import { Injectable } from '@angular/core';
import type { PlaidHandler, PlaidLinkOptions } from 'react-plaid-link';
import { LoggerFactory } from '../../../log/services/logger-factory/logger-factory.service';
import { Logger } from '../../../log/services/logger/logger.service';
import { Plaid } from '../../models/plaid/plaid.model';
import { LinkService } from '../link/link.service';

@Injectable({
	providedIn: 'root',
})
export class PlaidLinkService {
	private plaidHandler?: PlaidHandler;

	private readonly scriptSrc =
		'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

	private readonly logger: Logger;

	constructor(
		private readonly loggerFactory: LoggerFactory,
		private readonly linkService: LinkService,
	) {
		this.logger = this.loggerFactory.create(this);
	}

	/**
	 * Set up Plaid.
	 *
	 * It is recommended to call Plaid.create when initializing the view that is
	 * responsible for loading Plaid, as this will allow Plaid to pre-initialize
	 * Link, resulting in lower UI latency upon calling open, which can increase
	 * Link conversion.
	 * @param onSuccess On success callback.
	 * @param onLoad On load callback.
	 * @param onExit On exit callback.
	 * @param onEvent On event callback.
	 */
	public async create(
		onSuccess: PlaidLinkOptions['onSuccess'],
		onLoad: PlaidLinkOptions['onLoad'],
		onExit: PlaidLinkOptions['onExit'],
		onEvent: PlaidLinkOptions['onEvent'],
	) {
		await this.loadScript();
		this.logger.info(PlaidLinkService.name, 'Creating Plaid...');

		this.plaidHandler = this.getPlaid().create({
			token: this.linkService.linkToken(),
			onSuccess,
			onLoad,
			onExit,
			onEvent,
		});
	}

	public async open() {
		this.plaidHandler?.open();
	}

	/** Get Plaid form the global window object. */
	private getPlaid() {
		return (window as typeof window & { Plaid: Plaid }).Plaid;
	}

	/** Load Plaid script tag. */
	private loadScript() {
		return new Promise<void>((resolve, reject) => {
			if (this.isScriptPresent()) {
				resolve();
			}

			const script = document.createElement('script');
			script.src = this.scriptSrc;

			script.onload = () => resolve();

			script.onerror = () => reject('Failed to load Plaid script');
			document.head.appendChild(script);
		});
	}

	/**
	 * Check is Plaid script is loaded.
	 *
	 * This will search the DOM for a script tag with the Plaid src.
	 */
	private isScriptPresent() {
		return !!document.querySelector(`script[src="${this.scriptSrc}"]`);
	}
}
