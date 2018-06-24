import {Request, Response, Router} from 'express';
import R from 'ramda';
import {getConnection} from 'typeorm';

import {IngredientModel, InterfaceIngredientModel} from '../models/IngredientModel';
import {RecipeModel} from '../models/RecipeModel';

export const route = Router();

route.get('/list', async (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of recipes
    getConnection()
        .getRepository(RecipeModel)
        .find({relations: ['ingredients']})
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json(err));
  } else {
    // autocomplete
    getConnection()
        .getRepository(RecipeModel)
        .createQueryBuilder('recipe')
        .where(`name like %${req.query.contains}%`)
        .innerJoin('recipe.ingredients', 'ingredients')
        .getMany()
        .then(recipes => res.json(recipes))
        .catch(err => res.status(400).json(err));
  }
});

route.post('/', async (req: Request, res: Response) => {
  if (!R.has('body', req) || !R.has('name', req.body)) {
    return res.status(400).json({err: 'No ingredient information provided.'});
  }
  const name: string = req.body.name.trim().toLowerCase();
  if (R.isEmpty(name)) {
    return res.status(400).json({err: 'Empty recipe name.'});
  }

  const hasName = await getConnection().getRepository(RecipeModel).find({name});
  if (!R.isEmpty(hasName)) {
    return res.status(400).json({err: 'Recipe already registered.'});
  }

  let ingredients: Promise<IngredientModel[]>|undefined;
  if (!R.isNil(req.body.ingredients)) {
    ingredients = Promise.all(
        R.filter(
             (val: InterfaceIngredientModel) =>
                 R.not(R.isEmpty(val.name.trim())),
             req.body.ingredients)
            .map(async (ingredientJson: InterfaceIngredientModel) => {
              const ingredientToInsert = new IngredientModel();
              ingredientToInsert.name =
                  ingredientJson.name.trim().toLowerCase();

              const ingredient =
                  await getConnection().manager.save(ingredientToInsert);
              return ingredient;
            }));
  }

  const recipe = new RecipeModel();
  recipe.name = name;

  // TODO: how to unify this code?
  if (!R.isNil(ingredients)) {
    ingredients.then(ingredients => {
      recipe.ingredients = ingredients;

      getConnection()
          .manager.save(recipe)
          .then(recipe => res.json(recipe))
          .catch(err => res.status(400).json({error: err}));
    });
  } else {
    recipe.ingredients = [];

    getConnection()
        .manager.save(recipe)
        .then(recipe => res.json(recipe))
        .catch(err => res.status(400).json({error: err}));
  }

  return;
});
