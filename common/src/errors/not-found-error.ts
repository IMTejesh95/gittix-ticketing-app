import { CustomError, ErrorResponse } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super("Not found error");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors(): ErrorResponse[] {
        return [{
            message: "Not Found"
        }]
    }
}