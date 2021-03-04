import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly users: any = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userRepository
      .save(CreateUserDto.toEntity(createUserDto))
      .then((user) => CreateUserDto.fromEntity(user));
  }

  async findAll(): Promise<CreateUserDto[]> {
    return await this.userRepository
      .find()
      .then((users) => {
        const returnedUsers: CreateUserDto[] = [];
        users.forEach((user) => {
          returnedUsers.push(CreateUserDto.fromEntity(user));
        });

        return returnedUsers;
      })
      .catch((error) => {
        throw new HttpException(
          'Falha ao obter usuários',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async findOne(id: number): Promise<CreateUserDto | undefined> {
    return await this.userRepository
      .findOne(id)
      .then((user) => CreateUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException('Falha ao obter usuário', HttpStatus.NOT_FOUND);
      });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return await this.userRepository
      .update(id, updateUserDto)
      .then((user) => {
        return this.userRepository
          .findOne(id)
          .then((u) => UpdateUserDto.fromEntity(u));
      })
      .catch((error) => {
        throw new HttpException(
          'Falha ao atualizar dados do usuário',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async remove(id: number): Promise<DeleteUserDto> {
    return await this.userRepository
      .findOne(id)
      .then((user) => {
        return this.userRepository
          .delete(id)
          .then((u) => DeleteUserDto.fromEntity(user))
          .catch();
      })
      .catch((error) => {
        throw new HttpException(
          'Falha ao remover usuário',
          HttpStatus.NOT_FOUND,
        );
      });
  }
}
