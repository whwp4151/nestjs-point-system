import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-code";

export class CustomException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCode,
    message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, status);
  }
}