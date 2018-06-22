'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan = require('morgan');
require("reflect-metadata");
const config_json_1 = require("./config.json");
const recipes_1 = require("./routes/recipes");
const types_1 = require("./routes/types");
const typeorm_1 = require("typeorm");
const RecipeModel_1 = require("./models/RecipeModel");
const IngredientModel_1 = require("./models/IngredientModel");
const environment = process.env.NODE_ENV || 'development';
exports.server = typeorm_1.createConnection({
    'name': 'default',
    'type': 'sqlite',
    'database': 'test.db',
    'synchronize': true,
    'logging': false,
    'entities': [RecipeModel_1.RecipeModel, IngredientModel_1.IngredientModel],
    'subscribers': ['build/src/subscriber/*.js'],
    'migrations': ['build/src/migration/*.js'],
    'cli': {
        'entitiesDir': 'build/src/models',
        'migrationsDir': 'build/src/migration',
        'subscribersDir': 'build/src/subscriber'
    }
})
    .then((connection) => __awaiter(this, void 0, void 0, function* () {
    const server = express_1.default();
    server.use(cors_1.default());
    server.use(body_parser_1.default.json({ limit: config_json_1.config.bodyLimit }));
    server.use(morgan('combined'));
    server.get('/', (req, res) => {
        res.json({ version: process.env.npm_package_version });
    });
    server.use('/recipe', recipes_1.route);
    server.use('/types', types_1.route);
    const httpServer = server.listen(process.env.PORT || config_json_1.config.port, () => {
        let address;
        if (!(httpServer.address() instanceof String)) {
            address =
                httpServer.address().port.toString();
        }
        else {
            address = httpServer.address();
        }
        console.log(`Started on ${address} time : ${new Date()}`);
    });
    return server;
}))
    .catch(error => {
    console.error('Error connecting to database.');
    console.error(error);
});
//# sourceMappingURL=server.js.map