"use strict";
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
const express_1 = require("express");
const ingredients_1 = require("../models/ingredients");
const ramda_1 = __importDefault(require("ramda"));
const route = express_1.Router();
route.get('/', (req, res) => {
    if (!req.query.contains) {
        // full list of ingredients
        res.json({ ingredients: 'ingredients' });
    }
    else {
        // autocomplete
        res.json({});
    }
});
route.post('/new', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!ramda_1.default.has('body', req)
        || !ramda_1.default.has('name', req.body)) {
        res.json({
            err: 'Invalid ingredient name.'
        });
        return;
    }
    const name = req.body.name.trim();
    if (ramda_1.default.isEmpty(name)) {
        res.json({
            err: 'Invalid ingredient name.'
        });
        return;
    }
    const hasName = yield ingredients_1.IngredientName
        .query()
        .select('*')
        .whereExists;
    const ingredient = yield ingredients_1.Ingredient
        .query()
        .insert({});
    ingredients_1.IngredientName
        .query()
        .insert({
        ingredientId: ingredient.id,
        name: name
    });
}));
exports.default = (app) => {
    app.use('/ingredients', route);
};
//# sourceMappingURL=ingredients.js.map