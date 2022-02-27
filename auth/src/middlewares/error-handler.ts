import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";


const errorhandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if(err instanceof CustomError){
        return res.status(err.statusCode).json({errors: err.serializeErrors()})
    } 

    res.status(400).send([{message: "Something went wrong!"}]);
}

export default errorhandler;