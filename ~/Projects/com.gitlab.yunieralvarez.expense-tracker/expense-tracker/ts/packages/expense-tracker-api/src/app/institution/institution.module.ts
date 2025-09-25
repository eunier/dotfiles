import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { InstitutionEntity } from '~/app/institution/entities/institution/institution.entity';
import { InstitutionRepositoryProvider } from '~/app/institution/providers/institution-repository.provider';
import { InstitutionService } from '~/app/institution/services/institution/institution.service';
import { PlaidModule } from '~/app/plaid/plaid.module';

@Module({
	imports: [PlaidModule, MikroOrmModule.forFeature([InstitutionEntity])],
	providers: [InstitutionService, InstitutionRepositoryProvider],
	exports: [InstitutionService],
})
export class InstitutionModule {}
