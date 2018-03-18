const express = require('express');
const User = require('../models/user');
const passport = require('passport');

const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send();
});

router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).send();
});

router.get('/list', passport.authenticationMiddleware(), async (req, res) => {
    const users = await User.listAll();
    res.json(users);
});

router.post('/', async (req, res) => {
    try{
        await User.create(req.body);
        res.status(200).send();
    }catch(e){
        res.status(400).send('Invalid user: ' + e.message);
    }
});

module.exports = router