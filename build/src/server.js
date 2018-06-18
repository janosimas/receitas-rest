'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan = require('morgan');
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const config_json_1 = require("./config.json");
const ingredients_1 = require("./routes/ingredients");
const recipes_1 = require("./routes/recipes");
const types_1 = require("./routes/types");
const knexfile = require('../knexfile');
const environment = process.env.NODE_ENV || 'development';
const knex = knex_1.default(knexfile[environment]);
objection_1.Model.knex(knex);
exports.server = express_1.default();
exports.server.use(body_parser_1.default.json({ limit: config_json_1.config.bodyLimit }));
exports.server.use(morgan('combined'));
exports.server.get('/', (req, res) => {
    res.json({ version: process.env.npm_package_version });
});
exports.server.use('/ingredient', ingredients_1.route);
exports.server.use('/recipe', recipes_1.route);
exports.server.use('/types', types_1.route);
const httpServer = exports.server.listen(process.env.PORT || config_json_1.config.port, () => {
    let address;
    if (!(httpServer.address() instanceof String)) {
        address = httpServer.address().port.toString();
    }
    else {
        address = httpServer.address();
    }
    console.log(`Started on ${address} time : ${new Date()}`);
});
//# sourceMappingURL=server.js.map