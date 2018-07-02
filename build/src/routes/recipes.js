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
            .where("recipe.name like :text", { text: '%' + req.query.contains + '%' })
            .innerJoin('recipe.ingredients', 'ingredients')
            .getMany()
            .then(recipes => res.json(recipes))
            .catch(err => res.status(400).json(err));
    }
}));
// FIXME: post is being used for new recipes and updating recipes
exports.route.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!ramda_1.default.has('body', req) || !ramda_1.default.has('name', req.body)) {
        return res.status(400).json({ error: 'No recipe name provided.' });
    }
    const name = req.body.name.trim().toLowerCase();
    if (ramda_1.default.isEmpty(name)) {
        return res.status(400).json({ error: 'Empty recipe name.' });
    }
    const recipeList = yield typeorm_1.getConnection().getRepository(RecipeModel_1.RecipeModel).find({ name });
    if (!ramda_1.default.isEmpty(recipeList)) {
        if (ramda_1.default.has('id', req.body)) {
            const recipe = recipeList[0];
            if (recipe.id !== Number(req.body.id)) {
                return res.status(400).json({ error: 'Recipe name already in use.' });
            }
        }
        else {
            return res.status(400).json({ error: 'Recipe already registered.' });
        }
    }
    const cookingMethod = ramda_1.default.isNil(req.body.cookingMethod) ? undefined : req.body.cookingMethod.trim().toLowerCase();
    const description = ramda_1.default.isNil(req.body.description) ? undefined : req.body.description.trim().toLowerCase();
    let ingredients;
    if (!ramda_1.default.isNil(req.body.ingredients)) {
        ingredients = Promise.all(ramda_1.default.filter((val) => ramda_1.default.not(ramda_1.default.isEmpty(val.name.trim())), req.body.ingredients)
            .map((ingredientJson) => __awaiter(this, void 0, void 0, function* () {
            const ingredientToInsert = new IngredientModel_1.IngredientModel();
            ingredientToInsert.name = ingredientJson.name.trim().toLowerCase();
            ingredientToInsert.unit = ingredientJson.unit.trim().toLowerCase();
            ingredientToInsert.quantity = ingredientJson.quantity;
            const ingredient = yield typeorm_1.getConnection().manager.save(ingredientToInsert);
            return ingredient;
        })));
    }
    const recipe = ramda_1.default.isEmpty(recipeList) ? new RecipeModel_1.RecipeModel() : recipeList[0];
    recipe.name = name;
    recipe.cookingMethod = cookingMethod;
    recipe.description = description;
    if (ramda_1.default.has('id', req.body)) {
        recipe.id = Number(req.body.id);
    }
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