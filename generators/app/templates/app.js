const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const helmet = require('helmet');

const apiRouter = require('./app/api')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 * ----------
 *  Error Handler
 * ----------
 * https://expressjs.com/en/advanced/best-practice-security.html
 */


/**
 * ----------
 *  Security
 * ----------
 * https://expressjs.com/en/advanced/best-practice-security.html
 */

// Use helmet for http security. See https://www.npmjs.com/package/helmet for details
app.use(helmet());


app.use(apiRouter);

module.exports = app;
