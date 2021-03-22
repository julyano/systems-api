import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = exception.getStatus();
    let message = '';
    status = status === undefined ? 500 : status;

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        message = `Não autorizado`;
        break;
      case HttpStatus.NOT_FOUND:
        message = `Falha ao obter dados de ${exception.getResponse()}`;
        break;
      case HttpStatus.BAD_REQUEST:
        message = `Falta informações de algum campo de ${exception.getResponse()}`;
        break;
      case HttpStatus.NOT_MODIFIED:
        message = `Falha ao criar ou atualizar ${exception.getResponse()}`;
        break;
      case HttpStatus.NON_AUTHORITATIVE_INFORMATION:
        message = `Falha em ${exception.getResponse()}`;
        break;
      default:
        message = 'Erro interno';
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
