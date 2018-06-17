'use strict'

import express, { Response, Request } from "express";
import bodyParser from 'body-parser';
const morgan = require('morgan');

import Knex from "knex";
import { Model } from 'objection';

import configJson from './config.json';

import ingredientsRoute from "./routes/ingredients";
import recipesRoute from "./routes/recipes";
import typesRoute from "./routes/types";

const knexfile = require("./knexfile");

const environment = process.env.NODE_ENV || 'development';

const knex = Knex(knexfile[environment]);
Model.knex(knex);

const app = express();

app.use(bodyParser.json({ limit: configJson.bodyLimit }));
app.use(morgan('combined'))

app.get('/', (req: Request, res: Response) => {
  res.json({ version: process.env.npm_package_version });
});

ingredientsRoute(app);
recipesRoute(app);
typesRoute(app);

const server = app.listen(process.env.PORT || configJson.port, () => {

  let address: String;
  if (!(server.address() instanceof String)) {
    address = (<any>server.address()).port;
  } else {
    address = <string>server.address();
  }
  console.log(`Started on ${address} time : ${new Date()}`);
});