const express = require('express');
const bodyParser = require('body-parser');
const authConfig = require('./src/config/auth-config');
const session = require('express-session')
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser('todolist'));
app.use(session());
authConfig.config(app);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({
    "message": "Welcome to TODO-LIST server app for Toptal React Academy."
}));

app.use(require('./src/controllers'));

app.listen(3000, () => console.log("Server is listening on port 3000"));