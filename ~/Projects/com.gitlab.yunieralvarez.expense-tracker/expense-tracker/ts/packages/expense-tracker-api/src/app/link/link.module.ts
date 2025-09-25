import { Module } from '@nestjs/common';
import { ConfigModule } from '~/app/config/config.module';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionModule } from '~/app/institution/institution.module';
import { LinkController } from '~/app/link/controllers/link/link.controller';
import { LinkService } from '~/app/link/services/link/link.service';
import { OrmModule } from '~/app/orm/orm.module';
import { PlaidModule } from '~/app/plaid/plaid.module';
import { UserEntity } from '~/app/user/entities/user/user.entity';
import { UserModule } from '~/app/user/user.module';

@Module({
	imports: [
		OrmModule.forFeature([UserEntity, InstitutionEntity]),
		ConfigModule,
		InstitutionModule,
		PlaidModule,
		UserModule,
	],
	controllers: [LinkController],
	providers: [LinkService],
})
export class LinkModule {}
