import express from 'express';
import User from '../models/user';
import md5 from 'md5';
import TokenGenerator from 'uuid-token-generator';

const router = express.Router();

router.post('/login', async (req, res) => {
    const user = User.get(req.user.name);
    const md5Pwd = md5(req.user.password);
    if(md5Pwd === user.md5){
        const token = new TokenGenerator().generate();
        await User.saveToken(user.name, token);
        res.json({ token });
    }else{
        res.status(401).send('Invalid login');
    }
})

router.post('/', async (req, res) => {
    try{
        await User.create(user);
        res.status(200);
    }catch(e){
        res.status(400).send('Invalid user: ' + e.message);
    }
});

module.exports = router