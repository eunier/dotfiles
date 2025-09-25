import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from '~/app/auth/decorators/active-user.decorator';
import { ActiveUserData } from '~/app/auth/models/active-user-data.model';
import { ExchangePublicTokenRequestDto } from '~/app/link/dto/exchange-public-token-request.dto';
import { LinkService } from '~/app/link/services/link/link.service';

@ApiTags('Link')
@Controller('link')
export class LinkController {
	private readonly logger = new Logger(LinkController.name);

	public constructor(private readonly linkService: LinkService) {}

	@Get('token')
	public async getLinkToken(@ActiveUser('sub') userId: ActiveUserData['sub']) {
		this.logger.log('Creating Plaid Link token...');
		const response = await this.linkService.createLinkToken(userId);

		this.logger.debug(
			`Created Plaid Link token: ${JSON.stringify(response, null, 2)}`,
		);

		return response;
	}

	@Post('token/public/exchange')
	public async exchangePublicToken(
		@Body() exchangePublicTokenDto: ExchangePublicTokenRequestDto,
		@ActiveUser('sub') userId: ActiveUserData['sub'],
	) {
		this.logger.debug(
			`Exchanging '${exchangePublicTokenDto.publicToken}' public token for access token...`,
		);

		await this.linkService.exchangePublicToken(exchangePublicTokenDto, userId);

		this.logger.debug(
			`Exchanged '${exchangePublicTokenDto.publicToken}' public token for access token`,
		);
	}
}
