import { Application } from '../../entities/application.entity';

export class DeleteApplicationDto {
  id?: number;
  name: string;
  apikey?: string;

  public static from(dto: Partial<DeleteApplicationDto>) {
    const deleteApplicationrDTO = new DeleteApplicationDto();
    deleteApplicationrDTO.id = dto.id;
    deleteApplicationrDTO.name = dto.name;
    deleteApplicationrDTO.apikey = dto.apikey;
    return deleteApplicationrDTO;
  }

  public static fromEntity(entity: Application) {
    return this.from({
      id: entity.id,
      name: entity.name,
      apikey: entity.apikey,
    });
  }
}
