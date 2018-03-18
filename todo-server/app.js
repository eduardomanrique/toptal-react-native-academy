import express from 'express';
import bodyParser from 'body-parser';
import controllers from './src/controllers';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({
    "message": "Welcome to TODO-LIST server app for Toptal React Academy."
}));

app.use(controllers);

app.listen(3000, () => console.log("Server is listening on port 3000"));