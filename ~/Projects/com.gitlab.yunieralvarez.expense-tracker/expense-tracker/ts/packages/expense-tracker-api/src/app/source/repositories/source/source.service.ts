import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { SourceEntity } from '../../entities/source/source.entity';

@Injectable()
export class SourceRepository extends EntityRepository<SourceEntity> {}
