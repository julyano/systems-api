import { User } from '../entities/user.entity';

export class DeleteUserDto {
  id?: number;
  username: string;
  displayname?: string;
  fullname: string;
  email: string;
  password: string;

  public static from(dto: Partial<DeleteUserDto>) {
    const deleteeUserDTO = new DeleteUserDto();
    deleteeUserDTO.id = dto.id;
    deleteeUserDTO.username = dto.username;
    deleteeUserDTO.fullname = dto.fullname;
    deleteeUserDTO.email = dto.email;
    deleteeUserDTO.password = dto.password;
    return deleteeUserDTO;
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
}
