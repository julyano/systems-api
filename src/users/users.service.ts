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

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user = await this.userRepository
      .save(CreateUserDto.toEntity(createUserDto))
      .then((user) => user)
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });

    return CreateUserDto.fromEntity(user);
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
        throw new HttpException('usuários', error.status);
      });
  }

  async findOne(id: number): Promise<CreateUserDto> {
    if (!id) {
      throw new HttpException('usuário', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository
      .findOne(id)
      .then((user) => CreateUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });
  }

  async getUser(username: string, password: string): Promise<CreateUserDto> {
    if (!username || !password) {
      throw new HttpException('usuário', HttpStatus.BAD_REQUEST);
    }

    let result = null;

    await this.userRepository
      .createQueryBuilder('users')
      .where('users.username = :username', { username: username })
      .getOne()
      .then((user) => {
        result = user;
      })
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });

    if (!Crypto.check(password, result.password)) {
      throw new HttpException(
        'credenciais',
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    }

    return CreateUserDto.fromEntity(result);
  }

  async update(updateUserDto: UpdateUserDto): Promise<UpdateUserDto> {
    if (!updateUserDto.id) {
      throw new HttpException('usuário', HttpStatus.BAD_REQUEST);
    }

    const findedUser = await this.userRepository
      .findOne(updateUserDto.id)
      .then((user) => UpdateUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });

    if (updateUserDto?.password) {
      updateUserDto.password = await Crypto.encrypt(updateUserDto.password);
    }

    return await this.userRepository
      .update(findedUser.id, updateUserDto)
      .then((user) => {
        return UpdateUserDto.from({ id: findedUser.id });
      })
      .catch((error) => {
        console.log('error = ', error);
        throw new HttpException('usuário', error.status);
      });
  }

  async remove(id: number): Promise<DeleteUserDto> {
    if (!id) {
      throw new HttpException('usuário', HttpStatus.BAD_REQUEST);
    }

    const findedUser = await this.userRepository
      .findOne(id)
      .then((user) => DeleteUserDto.fromEntity(user))
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });

    return await this.userRepository
      .delete(findedUser.id)
      .then((user) => DeleteUserDto.from(findedUser))
      .catch((error) => {
        throw new HttpException('usuário', error.status);
      });
  }
}
