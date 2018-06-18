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
exports.route = express_1.Router();
exports.route.get('/', (req, res) => {
    if (!req.query.contains) {
        // full list of ingredients
        res.json({ ingredients: 'ingredients' });
    }
    else {
        // autocomplete
        res.json({});
    }
});
exports.route.post('/new', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!ramda_1.default.has('body', req) || !ramda_1.default.has('name', req.body)) {
        return res.json({ err: 'No ingredient information provided.' });
    }
    const name = req.body.name.trim();
    if (ramda_1.default.isEmpty(name)) {
        return res.json({ err: 'Empty ingredient name.' });
    }
    const hasName = yield ingredients_1.Ingredient.query().select('*').where({ name });
    if (!ramda_1.default.isEmpty(hasName)) {
        return res.json({ err: 'Ingredient already registered.' });
    }
    const ingredient = yield ingredients_1.Ingredient.query().insert({ name });
    return res.json(ingredient);
}));
//# sourceMappingURL=ingredients.js.map