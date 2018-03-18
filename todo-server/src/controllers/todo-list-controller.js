const express = require('express');
const TodoList = require('../models/todo-list');
const md5 = require('md5');
const passport = require('passport');

const router = express.Router();

router.post('/', passport.authenticationMiddleware(), async (req, res) => {
    try{
        await TodoList.insert(req.body);
        res.status(200).send();
    }catch(e){
        res.status(500).send('Error creating new todo list ' + e.message);
    }
});

router.put('/', passport.authenticationMiddleware(), async (req, res) => {
    try{
        await TodoList.update(req.body);
        res.status(200).send();
    }catch(e){
        res.status(500).send('Error updating todo list ' + e.message);
    }
});

router.post('/file/', passport.authenticationMiddleware(), async (req, res) => {
    try{
        await TodoList.addFile(req.params.username, req.params.todoId, req.files[0]);
        res.status(200).send();
    }catch(e){
        res.status(500).send('Error adding file to todo list ' + e.message);
    }
});

router.delete('/file/', passport.authenticationMiddleware(), async (req, res) => {
    try{
        await TodoList.addFile(req.params.username, req.params.todoId, req.params.filename);
        res.status(200).send();
    }catch(e){
        res.status(500).send('Error removing file to todo list ' + e.message);
    }
});

router.get('/list', passport.authenticationMiddleware(), async (req, res) => {
    const list = await TodoList.search(req.query.name);
    res.json(list);
});

router.get('/', passport.authenticationMiddleware(), async (req, res) => {
    try{
        const todoList = await TodoList.get(req.params.id);
        res.json(todoList);
    }catch(e){
        res.status(400).send('Invalid todo list: ' + e.message);
    }
});

module.exports = router