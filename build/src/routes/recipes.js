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
const ramda_1 = __importDefault(require("ramda"));
const ingredients_1 = require("../models/ingredients");
const recipes_1 = require("../models/recipes");
exports.route = express_1.Router();
exports.route.get('/list', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.query.contains) {
        // full list of recipes
        const recipes = yield recipes_1.Recipe.query().select('*');
        return res.json(recipes);
    }
    else {
        // autocomplete
        console.log(`%${req.query.contains}%`);
        const recipes = yield recipes_1.Recipe.query().select('*').where('name', 'like', `%${req.query.contains}%`);
        return res.json(recipes);
    }
}));
exports.route.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!ramda_1.default.has('body', req) || !ramda_1.default.has('name', req.body)) {
        return res.json({ err: 'No ingredient information provided.' });
    }
    const name = req.body.name.trim().toLowerCase();
    if (ramda_1.default.isEmpty(name)) {
        return res.json({ err: 'Empty recipe name.' });
    }
    const hasName = yield recipes_1.Recipe.query().select('*').where({ name });
    if (!ramda_1.default.isEmpty(hasName)) {
        return res.json({ err: 'Recipe already registered.' });
    }
    let cookingMethod = req.body.cookingMethod;
    if (!ramda_1.default.isNil(cookingMethod)) {
        cookingMethod = cookingMethod.trim().toLowerCase();
    }
    const ingredientsId = req.body.ingredients || [];
    const ingredients = yield ingredients_1.Ingredient.query().select('*').whereIn('id', ingredientsId);
    const recipes = yield recipes_1.Recipe.query()
        .insert({ name, cookingMethod, ingredients })
        .skipUndefined();
    return res.json(recipes);
}));
//# sourceMappingURL=recipes.js.map