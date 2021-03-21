import { Application } from '../../entities/application.entity';

export class UpdateApplicationDto {
  id?: number;
  name: string;
  apikey?: string;

  public static from(dto: Partial<UpdateApplicationDto>) {
    const updateApplicationrDTO = new UpdateApplicationDto();
    updateApplicationrDTO.id = dto.id;
    updateApplicationrDTO.name = dto.name;
    updateApplicationrDTO.apikey = dto.apikey;
    return updateApplicationrDTO;
  }

  public static fromEntity(entity: Application) {
    return this.from({
      id: entity.id,
      name: entity.name,
      apikey: entity.apikey,
    });
  }
}
