import { Application } from 'src/entities/application.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {}
