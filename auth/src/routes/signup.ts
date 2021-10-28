import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
    '/api/users/signup',
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 chars."),
    (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw Error("Invalid email or password")
        }

        const { email, password } = req.body;
        throw Error("Failed to connect to database")
        res.send("Signing Up")
    });

export { router as signUpRouter };