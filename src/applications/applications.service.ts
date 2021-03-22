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
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
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
      .catch((error) => {
        throw new HttpException('aplicações', error.status);
      });
  }

  async findAllRelated(
    createUserDto: CreateUserDto,
  ): Promise<CreateApplicationDto[]> {
    if (!createUserDto.id) {
      throw new HttpException('usuário', HttpStatus.BAD_REQUEST);
    }

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
      .catch((error) => {
        throw new HttpException('aplicações', error.status);
      });
  }

  async findOne(id: number): Promise<CreateApplicationDto> {
    if (!id) {
      throw new HttpException('aplicação', HttpStatus.BAD_REQUEST);
    }

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
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
      });
  }

  async update(
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<CreateApplicationDto> {
    if (!updateApplicationDto.id) {
      throw new HttpException('aplicação', HttpStatus.BAD_REQUEST);
    }

    const findedApp = await this.applicationRepository
      .findOne(updateApplicationDto.id)
      .then((app) => UpdateApplicationDto.fromEntity(app))
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
      });

    return await this.applicationRepository
      .update(findedApp.id, updateApplicationDto)
      .then((app) => {
        return UpdateApplicationDto.from(updateApplicationDto);
      })
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
      });
  }

  async remove(id: number): Promise<DeleteApplicationDto> {
    if (!id) {
      throw new HttpException('aplicação', HttpStatus.BAD_REQUEST);
    }

    const findedApp = await this.applicationRepository
      .findOne(id)
      .then((app) => DeleteApplicationDto.fromEntity(app))
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
      });

    return await this.applicationRepository
      .delete(findedApp.id)
      .then((app) => DeleteApplicationDto.from(findedApp))
      .catch((error) => {
        throw new HttpException('aplicação', error.status);
      });
  }
}
