import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InstitutionEntity } from '../../entities/institution/institution.entity';

@Injectable()
export class InstitutionRepository extends EntityRepository<InstitutionEntity> {}
