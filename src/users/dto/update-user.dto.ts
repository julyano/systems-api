import { User } from '../entities/user.entity';

export class UpdateUserDto {
  id?: number;
  username: string;
  displayname?: string;
  fullname: string;
  email: string;
  password: string;

  public static from(dto: Partial<UpdateUserDto>) {
    const updateUserDTO = new UpdateUserDto();
    updateUserDTO.id = dto.id;
    updateUserDTO.username = dto.username;
    updateUserDTO.fullname = dto.fullname;
    updateUserDTO.email = dto.email;
    return updateUserDTO;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      username: entity.username,
      fullname: entity.fullname,
      email: entity.email,
    });
  }
}
