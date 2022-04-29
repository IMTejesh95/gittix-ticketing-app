import { CustomError, ErrorResponse } from "./custom-error";

export class DatabaseConnectionError extends CustomError {

    statusCode = 500;

    constructor() {
        super("Error connecting to database");
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): ErrorResponse[] {
        return [{
            message: "Error connecting to database"
        }];
    }

}