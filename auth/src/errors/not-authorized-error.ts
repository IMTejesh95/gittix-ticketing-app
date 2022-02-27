import { CustomError, ErrorResponse } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized");
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorResponse[] {
    return [
      {
        message: "Not authorized",
      },
    ];
  }
}
