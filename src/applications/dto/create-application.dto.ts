import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Application } from '../../entities/application.entity';

export class CreateApplicationDto {
  id?: number;
  userDto?: CreateUserDto = new CreateUserDto();
  name: string;
  apikey?: string;

  public static from(dto: Partial<CreateApplicationDto>) {
    const createApplicationDTO = new CreateApplicationDto();
    createApplicationDTO.id = dto.id;
    createApplicationDTO.userDto = dto.userDto;
    createApplicationDTO.name = dto.name;
    createApplicationDTO.apikey = dto.apikey;
    return createApplicationDTO;
  }

  public static fromEntity(entity: Application) {
    return this.from({
      id: entity.id,
      userDto: CreateUserDto.fromEntity(entity.owner),
      name: entity.name,
      apikey: entity.apikey,
    });
  }

  public static toEntity(dto: CreateApplicationDto) {
    const application = new Application();
    application.owner = CreateUserDto.toEntity(dto.userDto);
    application.name = dto.name;
    application.apikey = dto.apikey;
    application.createDateTime = new Date();
    application.createdBy = dto.userDto.username;
    application.lastChangedBy = dto.userDto.username;
    return application;
  }
}
