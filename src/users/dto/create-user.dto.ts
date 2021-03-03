import { User } from '../entities/user.entity';

export class CreateUserDto {
  public id: number;
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
    console.log('entity = ', entity);

    return this.from({
      id: entity.id,
      username: entity.username,
      fullname: entity.fullname,
      email: entity.email,
      password: entity.password,
    });
  }

  public static toEntity(user: User = null) {
    console.log('user = ', user);
    console.log('this = ', this.prototype.username);

    const userAux = new User();
    userAux.id = this.prototype.id;
    userAux.username = this.prototype.username;
    userAux.fullname = this.prototype.fullname;
    userAux.createDateTime = new Date();
    userAux.createdBy = this.prototype.id as any; //user ? (user.id as any) : null;
    userAux.lastChangedBy = this.prototype.id as any; //user ? (user.id as any) : null;
    return userAux;
  }
}
