import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../entities/transaction/transaction.entity';

@Injectable()
export class TransactionRepository extends EntityRepository<TransactionEntity> {}
