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
const config_json_1 = __importDefault(require("./config.json"));
const ingredients_1 = __importDefault(require("./routes/ingredients"));
const recipes_1 = __importDefault(require("./routes/recipes"));
const types_1 = __importDefault(require("./routes/types"));
const knexfile = require("./knexfile");
const environment = process.env.NODE_ENV || 'development';
const knex = knex_1.default(knexfile[environment]);
objection_1.Model.knex(knex);
const app = express_1.default();
app.use(body_parser_1.default.json({ limit: config_json_1.default.bodyLimit }));
app.use(morgan('combined'));
app.get('/', (req, res) => {
    res.json({ version: process.env.npm_package_version });
});
ingredients_1.default(app);
recipes_1.default(app);
types_1.default(app);
const server = app.listen(process.env.PORT || config_json_1.default.port, () => {
    let address;
    if (!(server.address() instanceof String)) {
        address = server.address().port;
    }
    else {
        address = server.address();
    }
    console.log(`Started on ${address} time : ${new Date()}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map