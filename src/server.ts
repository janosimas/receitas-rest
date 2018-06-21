'use strict';

import express, {Response, Request} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const morgan = require('morgan');

import Knex from 'knex';
import {Model} from 'objection';

import {config as configJson} from './config.json';

import {route as recipesRoute} from './routes/recipes';
import {route as typesRoute} from './routes/types';
import {AddressInfo} from 'net';

const knexfile = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';

const knex = Knex(knexfile[environment]);
Model.knex(knex);

export const server = express();

server.use(cors());
server.use(bodyParser.json({limit: configJson.bodyLimit}));
server.use(morgan('combined'));

server.get('/', (req: Request, res: Response) => {
  res.json({version: process.env.npm_package_version});
});

server.use('/recipe', recipesRoute);
server.use('/types', typesRoute);

const httpServer = server.listen(process.env.PORT || configJson.port, () => {
  let address: string;
  if (!(httpServer.address() instanceof String)) {
    address = (httpServer.address() as AddressInfo).port.toString();
  } else {
    address = httpServer.address() as string;
  }
  console.log(`Started on ${address} time : ${new Date()}`);
});
