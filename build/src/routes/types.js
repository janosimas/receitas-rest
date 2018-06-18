"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.route = express_1.Router();
exports.route.get('/', (req, res) => {
    res.json({
        cooking_method: ['fogão', 'forno', 'forno combinado'],
    });
});
//# sourceMappingURL=types.js.map