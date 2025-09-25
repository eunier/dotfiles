import { PlaidLib } from "~/app/plaid/libs/plaid.lib";

export class LinkTokenDto {
	public readonly linkToken: string;

	constructor(linkToken: string) {
		this.linkToken = linkToken;
	}

	public static fromPlaidLinkTokenCreateResponse(response: PlaidLib.LinkTokenCreateResponse) {
		return new LinkTokenDto(response.link_token);
	}
}
