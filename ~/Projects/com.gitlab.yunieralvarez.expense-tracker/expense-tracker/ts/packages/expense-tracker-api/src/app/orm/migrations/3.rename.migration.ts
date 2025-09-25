import { Migration } from '@mikro-orm/migrations';

export class Migration20250511201823 extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table "institution" rename column "institution_plaid_id" to "plaid_id";`,
		);

		this.addSql(
			`alter table "source" rename column "plaid_source_id" to "plaid_id";`,
		);

		this.addSql(
			`alter table "transaction" rename column "pending_transaction_id" to "pending_plaid_transaction_id";`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(
			`alter table "institution" rename column "plaid_id" to "institution_plaid_id";`,
		);

		this.addSql(
			`alter table "source" rename column "plaid_id" to "plaid_source_id";`,
		);

		this.addSql(
			`alter table "transaction" rename column "pending_plaid_transaction_id" to "pending_transaction_id";`,
		);
	}
}
