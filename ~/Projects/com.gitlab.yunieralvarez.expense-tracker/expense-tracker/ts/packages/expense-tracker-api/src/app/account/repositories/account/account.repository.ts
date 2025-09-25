import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from '~/app/account/entities/account/account.entity';

@Injectable()
export class AccountRepository extends EntityRepository<AccountEntity> {}
