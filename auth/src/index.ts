import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongo from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import errorhandler from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';


const app = express();
app.set('trust proxy', true);
// middlewares
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));


// routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.get('*', () => {
    throw new NotFoundError();
});

app.use(errorhandler)


const start = async () => {
    try {
        await mongo.connect("mongodb://auth-mongo-svc:27017/auth");
        console.log("Connected to auth-mongo db!")
    } catch (error) {
        console.log(error);
    }
}
start();

app.listen(3000, () => {
    console.log("Listing on port 3000 ;-)")
});
