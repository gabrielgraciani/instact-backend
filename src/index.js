const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv/config');
const { errors } = require('celebrate');
const routes = require('./routes');
global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(routes);
app.use(errors());

app.listen(process.env.PORT || 3001);