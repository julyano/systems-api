import { User } from '../entities/user.entity';

export class CreateUserDto {
  id?: number;
  username: string;
  displayname?: string;
  fullname: string;
  email: string;
  password: string;

  public static from(dto: Partial<CreateUserDto>) {
    const createUserDTO = new CreateUserDto();
    createUserDTO.id = dto.id;
    createUserDTO.username = dto.username;
    createUserDTO.fullname = dto.fullname;
    createUserDTO.email = dto.email;
    createUserDTO.password = dto.password;
    return createUserDTO;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      username: entity.username,
      fullname: entity.fullname,
      email: entity.email,
      password: entity.password,
    });
  }

  public static toEntity(dto: CreateUserDto) {
    const user = new User();
    user.username = dto.username;
    user.fullname = dto.fullname;
    user.email = dto.email;
    user.role = 'USER';
    user.password = dto.password;
    user.createDateTime = new Date();
    user.createdBy = dto.username;
    user.lastChangedBy = dto.username;
    return user;
  }
}
