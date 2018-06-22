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

  const hasName = true;  // await RecipeModel.query().select('*').where({name});
  // if (!R.isEmpty(hasName)) {
  //   return res.status(400).json({err: 'Recipe already registered.'});
  // }

  let cookingMethod: string = req.body.cookingMethod;
  if (!R.isNil(cookingMethod)) {
    cookingMethod = cookingMethod.trim().toLowerCase();
  }

  let ingredients: Promise<IngredientModel[]> =
      new Promise<IngredientModel[]>(() => []);
  if (!R.isNil(req.body.ingredients)) {
    ingredients = Promise.all(req.body.ingredients.map(
        async (ingredientJson: InterfaceIngredientModel) => {
          const ingredientToInsert = new IngredientModel();
          ingredientToInsert.name = ingredientJson.name.trim().toLowerCase();

          const ingredient =
              await getConnection().manager.save(ingredientToInsert);
          return ingredient;
        }));
  }

  ingredients.then(ingredients => {
    const recipe = new RecipeModel();
    recipe.name = name;
    recipe.ingredients = ingredients;

    getConnection()
        .manager.save(recipe)
        .then(recipe => res.json(recipe))
        .catch(err => res.status(400).json({error: err}));
  });

  return;
});
