"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.route = express_1.Router();
exports.route.get('/', (req, res) => {
    if (!req.query.contains) {
        // full list of recipes
        res.json({ recipes: 'recipes' });
    }
    else {
        // autocomplete
        res.json({});
    }
});
//# sourceMappingURL=recipes.js.map