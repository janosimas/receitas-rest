import { Request, Response, Router } from 'express';
import R from 'ramda';
import { getConnection } from 'typeorm';

import { IngredientModel, InterfaceIngredientModel } from '../models/IngredientModel';
import { RecipeModel } from '../models/RecipeModel';

export const route = Router();

route.get('/list', async (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of recipes
    getConnection()
      .getRepository(RecipeModel)
      .find({ relations: ['ingredients'] })
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

// FIXME: post is being used for new recipes and updating recipes
route.post('/', async (req: Request, res: Response) => {
  if (!R.has('body', req) || !R.has('name', req.body)) {
    return res.status(400).json({ error: 'No recipe name provided.' });
  }
  const name: string = req.body.name.trim().toLowerCase();
  if (R.isEmpty(name)) {
    return res.status(400).json({ error: 'Empty recipe name.' });
  }

  const recipeList = await getConnection().getRepository(RecipeModel).find({ name });
  if (!R.isEmpty(recipeList)) {
    if (R.has('id', req.body)) {
      const recipe = recipeList[0];
      if (recipe.id !== Number(req.body.id)) {
        return res.status(400).json({ error: 'Recipe name already in use.' });
      }
    } else {
      return res.status(400).json({ error: 'Recipe already registered.' });
    }
  }

  const cookingMethod: string = R.isNil(req.body.cookingMethod) ? undefined : req.body.cookingMethod.trim().toLowerCase();
  const description: string = R.isNil(req.body.description) ? undefined : req.body.description.trim().toLowerCase();


  let ingredients: Promise<IngredientModel[]> | undefined;
  if (!R.isNil(req.body.ingredients)) {
    ingredients = Promise.all(
      R.filter(
        (val: InterfaceIngredientModel) =>
          R.not(R.isEmpty(val.name.trim())),
        req.body.ingredients)
        .map(async (ingredientJson: InterfaceIngredientModel) => {
          const ingredientToInsert = new IngredientModel();
          ingredientToInsert.name = ingredientJson.name.trim().toLowerCase();
          ingredientToInsert.unit = ingredientJson.unit.trim().toLowerCase();
          ingredientToInsert.quantity = ingredientJson.quantity;

          const ingredient =
            await getConnection().manager.save(ingredientToInsert);
          return ingredient;
        }));
  }

  const recipe = R.isEmpty(recipeList) ? new RecipeModel() : recipeList[0];
  recipe.name = name;
  recipe.cookingMethod = cookingMethod;
  recipe.description = description;
  if (R.has('id', req.body)) {
    recipe.id = Number(req.body.id);
  }

  // TODO: how to unify this code?
  if (!R.isNil(ingredients)) {
    ingredients.then(ingredients => {
      recipe.ingredients = ingredients;

      getConnection()
        .manager.save(recipe)
        .then(recipe => res.json(recipe))
        .catch(err => res.status(400).json({ error: err }));
    });
  } else {
    recipe.ingredients = [];

    getConnection()
      .manager.save(recipe)
      .then(recipe => res.json(recipe))
      .catch(err => res.status(400).json({ error: err }));
  }

  return;
});
