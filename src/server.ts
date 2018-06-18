'use strict';

import express, {Response, Request} from 'express';
import bodyParser from 'body-parser';
const morgan = require('morgan');

import Knex from 'knex';
import {Model} from 'objection';

import {config as configJson} from './config.json';

import {route as ingredientsRoute} from './routes/ingredients';
import {route as recipesRoute} from './routes/recipes';
import {route as typesRoute} from './routes/types';
import {AddressInfo} from 'net';

const knexfile = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

const knex = Knex(knexfile[environment]);
Model.knex(knex);

export const app = express();

app.use(bodyParser.json({limit: configJson.bodyLimit}));
app.use(morgan('combined'));

app.get('/', (req: Request, res: Response) => {
  res.json({version: process.env.npm_package_version});
});

app.use('/ingredients', ingredientsRoute);
app.use('/recipes', recipesRoute);
app.use('/types', typesRoute);

const server = app.listen(process.env.PORT || configJson.port, () => {
  let address: string;
  if (!(server.address() instanceof String)) {
    address = (server.address() as AddressInfo).port.toString();
  } else {
    address = server.address() as string;
  }
  console.log(`Started on ${address} time : ${new Date()}`);
});
