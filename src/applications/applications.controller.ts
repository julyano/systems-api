import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpExceptionFilter } from 'src/exceptions/http-exception.filter';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { DeleteApplicationDto } from './dto/delete-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
@UseFilters(HttpExceptionFilter)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<CreateApplicationDto> {
    return this.applicationsService.create(createApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<CreateApplicationDto[]> {
    return this.applicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/related')
  findAllRelated(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateApplicationDto[]> {
    return this.applicationsService.findAllRelated(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateApplicationDto> {
    return this.applicationsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<UpdateApplicationDto> {
    return this.applicationsService.update(updateApplicationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteApplicationDto> {
    return this.applicationsService.remove(+id);
  }
}
