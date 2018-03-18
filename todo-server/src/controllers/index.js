const express = require('express');
const user = require('../controllers/user-controller');
const todoList = require('../controllers/todo-list-controller');

const router = express.Router();

router.use('/user', user);
router.use('/todolist', todoList);

module.exports = router