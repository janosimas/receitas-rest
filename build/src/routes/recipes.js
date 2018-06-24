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
const typeorm_1 = require("typeorm");
const IngredientModel_1 = require("../models/IngredientModel");
const RecipeModel_1 = require("../models/RecipeModel");
exports.route = express_1.Router();
exports.route.get('/list', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.query.contains) {
        // full list of recipes
        typeorm_1.getConnection()
            .getRepository(RecipeModel_1.RecipeModel)
            .find({ relations: ['ingredients'] })
            .then(recipes => res.json(recipes))
            .catch(err => res.status(400).json(err));
    }
    else {
        // autocomplete
        typeorm_1.getConnection()
            .getRepository(RecipeModel_1.RecipeModel)
            .createQueryBuilder('recipe')
            .where(`name like %${req.query.contains}%`)
            .innerJoin('recipe.ingredients', 'ingredients')
            .getMany()
            .then(recipes => res.json(recipes))
            .catch(err => res.status(400).json(err));
    }
}));
exports.route.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!ramda_1.default.has('body', req) || !ramda_1.default.has('name', req.body)) {
        return res.status(400).json({ err: 'No ingredient information provided.' });
    }
    const name = req.body.name.trim().toLowerCase();
    if (ramda_1.default.isEmpty(name)) {
        return res.status(400).json({ err: 'Empty recipe name.' });
    }
    const hasName = yield typeorm_1.getConnection().getRepository(RecipeModel_1.RecipeModel).find({ name });
    if (!ramda_1.default.isEmpty(hasName)) {
        return res.status(400).json({ err: 'Recipe already registered.' });
    }
    let ingredients;
    if (!ramda_1.default.isNil(req.body.ingredients)) {
        ingredients = Promise.all(ramda_1.default.filter((val) => ramda_1.default.not(ramda_1.default.isEmpty(val.name.trim())), req.body.ingredients)
            .map((ingredientJson) => __awaiter(this, void 0, void 0, function* () {
            const ingredientToInsert = new IngredientModel_1.IngredientModel();
            ingredientToInsert.name =
                ingredientJson.name.trim().toLowerCase();
            const ingredient = yield typeorm_1.getConnection().manager.save(ingredientToInsert);
            return ingredient;
        })));
    }
    const recipe = new RecipeModel_1.RecipeModel();
    recipe.name = name;
    // TODO: how to unify this code?
    if (!ramda_1.default.isNil(ingredients)) {
        ingredients.then(ingredients => {
            recipe.ingredients = ingredients;
            typeorm_1.getConnection()
                .manager.save(recipe)
                .then(recipe => res.json(recipe))
                .catch(err => res.status(400).json({ error: err }));
        });
    }
    else {
        recipe.ingredients = [];
        typeorm_1.getConnection()
            .manager.save(recipe)
            .then(recipe => res.json(recipe))
            .catch(err => res.status(400).json({ error: err }));
    }
    return;
}));
//# sourceMappingURL=recipes.js.map