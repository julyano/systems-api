import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApplicationRepository } from './applications.repository';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DeleteApplicationDto } from './dto/delete-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(ApplicationRepository)
    private applicationRepository: ApplicationRepository,
  ) {}

  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<CreateApplicationDto> {
    const app = await this.applicationRepository
      .save(CreateApplicationDto.toEntity(createApplicationDto))
      .then((result) => {
        return CreateApplicationDto.fromEntity(result);
      })
      .catch((e) => {
        throw new HttpException(
          'Falha ao criar aplicação',
          HttpStatus.NOT_FOUND,
        );
      });

    return app;
  }

  async findAll(): Promise<CreateApplicationDto[]> {
    return await this.applicationRepository
      .find({
        relations: ['owner'],
      })
      .then((app) => {
        const returnedApps: CreateApplicationDto[] = [];
        app.forEach((element) => {
          if (element?.owner != null) {
            returnedApps.push(CreateApplicationDto.fromEntity(element));
          }
        });
        return returnedApps;
      })
      .catch((e) => {
        throw new HttpException(
          'Falha ao obter aplicações',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async findAllRelated(
    createUserDto: CreateUserDto,
  ): Promise<CreateApplicationDto[]> {
    return await this.applicationRepository
      .find({
        relations: ['owner'],
        where: {
          owner: { id: createUserDto.id },
        },
      })
      .then((app) => {
        const returnedApps: CreateApplicationDto[] = [];
        app.forEach((element) => {
          if (element?.owner != null) {
            returnedApps.push(CreateApplicationDto.fromEntity(element));
          }
        });
        return returnedApps;
      })
      .catch((e) => {
        throw new HttpException(
          'Falha ao obter aplicações',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async findOne(id: number): Promise<CreateApplicationDto> {
    return await this.applicationRepository
      .find({
        relations: ['owner'],
        where: {
          id: id,
        },
      })
      .then((app) => {
        let returnedApps: CreateApplicationDto;
        app.forEach((element) => {
          if (element?.owner != null) {
            returnedApps = CreateApplicationDto.fromEntity(element);
          }
        });
        return returnedApps;
      })
      .catch((e) => {
        throw new HttpException(
          'Falha ao obter aplicação',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async update(
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<CreateApplicationDto> {
    const findedApp = await this.applicationRepository
      .findOne(updateApplicationDto.id)
      .then((app) => UpdateApplicationDto.fromEntity(app))
      .catch((error) => {
        throw new HttpException(
          'Falha ao encontrar aplicação',
          HttpStatus.NOT_FOUND,
        );
      });

    return await this.applicationRepository
      .update(findedApp.id, updateApplicationDto)
      .then((app) => {
        return UpdateApplicationDto.from(updateApplicationDto);
      })
      .catch((error) => {
        throw new HttpException(
          'Falha ao atualizar dados da aplicação',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async remove(id: number): Promise<DeleteApplicationDto> {
    const findedApp = await this.applicationRepository
      .findOne(id)
      .then((app) => DeleteApplicationDto.fromEntity(app))
      .catch((error) => {
        throw new HttpException(
          'Falha ao encontrar aplicação',
          HttpStatus.NOT_FOUND,
        );
      });

    return await this.applicationRepository
      .delete(findedApp.id)
      .then((app) => DeleteApplicationDto.from(findedApp))
      .catch((error) => {
        throw new HttpException(
          'Falha ao remover aplicação',
          HttpStatus.NOT_FOUND,
        );
      });
  }
}
