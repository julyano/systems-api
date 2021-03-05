import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crypto } from 'src/security/crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
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

  async findOne(id: number): Promise<CreateUserDto> {
    return await this.userRepository
      .findOne(id)
      .then((user) => CreateUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException('Falha ao obter usuário', HttpStatus.NOT_FOUND);
      });
  }

  async getUser(username: string, password: string): Promise<CreateUserDto> {
    let result = null;
    password = await Crypto.encrypt(password);

    await this.userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username: username })
      .andWhere('users.password = :password', { password: password })
      .getOne()
      .then((user) => {
        result = CreateUserDto.fromEntity(user);
      })
      .catch((error) => {
        throw new HttpException('Falha ao obter usuário', HttpStatus.NOT_FOUND);
      });

    return result;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const findedUser = await this.userRepository
      .findOne(id)
      .then((user) => UpdateUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException(
          'Falha ao encontrar usuário',
          HttpStatus.NOT_FOUND,
        );
      });

    if (updateUserDto.password) {
      updateUserDto.password = await Crypto.encrypt(updateUserDto.password);
    }

    return await this.userRepository
      .update(id, updateUserDto)
      .then((user) => {
        return UpdateUserDto.from(updateUserDto);
      })
      .catch((error) => {
        throw new HttpException(
          'Falha ao atualizar dados do usuário',
          HttpStatus.NOT_FOUND,
        );
      });
  }

  async remove(id: number): Promise<DeleteUserDto> {
    const findedUser = await this.userRepository
      .findOne(id)
      .then((user) => DeleteUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException(
          'Falha ao encontrar usuário',
          HttpStatus.NOT_FOUND,
        );
      });

    return await this.userRepository
      .delete(id)
      .then((user) => DeleteUserDto.from(findedUser))
      .catch((error) => {
        throw new HttpException(
          'Falha ao remover usuário',
          HttpStatus.NOT_FOUND,
        );
      });
  }
}
