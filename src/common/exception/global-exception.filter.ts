import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { ErrorCode } from "./error-code";
import { CustomException } from "./custom.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = 500;
        let code = ErrorCode.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof CustomException) {
            status = exception.getStatus();
            code = exception.errorCode;
            message = exception.message;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }

        console.error(exception);

        response.status(status).json({
            code,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
