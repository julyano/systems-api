import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../dto/create-user.dto';

export class User extends PartialType(CreateUserDto) {}
