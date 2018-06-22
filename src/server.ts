'use strict';

import express, {Response, Request} from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const morgan = require('morgan');

import 'reflect-metadata';

import {config as configJson} from './config.json';

import {route as recipesRoute} from './routes/recipes';
import {route as typesRoute} from './routes/types';
import {AddressInfo} from 'net';
import {createConnection, ConnectionOptions, Connection} from 'typeorm';
import {RecipeModel} from './models/RecipeModel';
import {IngredientModel} from './models/IngredientModel';

const environment = process.env.NODE_ENV || 'development';

export const server =
    createConnection({
      'name': 'default',
      'type': 'sqlite',
      'database': 'test.db',
      'synchronize': true,
      'logging': false,
      'entities': [RecipeModel, IngredientModel],
      'subscribers': ['build/src/subscriber/*.js'],
      'migrations': ['build/src/migration/*.js'],
      'cli': {
        'entitiesDir': 'build/src/models',
        'migrationsDir': 'build/src/migration',
        'subscribersDir': 'build/src/subscriber'
      }
    })
        .then(async connection => {
          const server = express();

          server.use(cors());
          server.use(bodyParser.json({limit: configJson.bodyLimit}));
          server.use(morgan('combined'));

          server.get('/', (req: Request, res: Response) => {
            res.json({version: process.env.npm_package_version});
          });

          server.use('/recipe', recipesRoute);
          server.use('/types', typesRoute);

          const httpServer =
              server.listen(process.env.PORT || configJson.port, () => {
                let address: string;
                if (!(httpServer.address() instanceof String)) {
                  address =
                      (httpServer.address() as AddressInfo).port.toString();
                } else {
                  address = httpServer.address() as string;
                }
                console.log(`Started on ${address} time : ${new Date()}`);
              });
          return server;
        })
        .catch(error => {
          console.error('Error connecting to database.');
          console.error(error);
        });
