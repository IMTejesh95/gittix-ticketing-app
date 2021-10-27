import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res) => {
    const {email, password} = req.body;

    res.send("Signing Up")
});

export {router as signUpRouter};