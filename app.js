var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const authRouter = require('./app/auth/router');
const noteRouter = require('./app/note/router');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { decodeToken } = require('./app/auth/middleware');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Note API Docs',
    version: '1.0.0',
    description:
      'Documentation for Note App using ExpressJS and MongoDB.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'Koh Endru',
      url: 'https://github.com/J3ndra',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://note-app-697812.herokuapp.com/',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./app/*/*.js'],
  customSiteTitle: "Note App Docs",
  customCss: '.swagger-ui .topbar { display: none }',
};

const swaggerSpec = swaggerJSDoc(options);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(decodeToken());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/api', noteRouter);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, options));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// disable cache but this solution is bad (rework later)
app.disable('etag');

module.exports = app;
