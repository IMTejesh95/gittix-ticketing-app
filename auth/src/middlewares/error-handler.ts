import { NextFunction, Request, Response } from "express";


const errorhandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    console.log(err.message);
    res.status(400).send("Something went wrong!");
}

export default errorhandler;