const express = require('express');
const cors = require('cors');
require('dotenv/config');
const { errors } = require('celebrate');
const routes = require('./routes');
const path = require('path');

global.__basedir = __dirname;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
app.use(routes);
app.use(errors());

app.listen(process.env.PORT || 3001);