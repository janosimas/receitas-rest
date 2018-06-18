import {Request, Response, Router} from 'express';
import R from 'ramda';

import {Ingredient} from '../models/ingredients';
import {Recipe} from '../models/recipes';

export const route = Router();

route.get('/list', async (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of recipes
    const recipes = await Recipe.query().select('*');
    return res.json(recipes);
  } else {
    // autocomplete
    console.log(`%${req.query.contains}%`);
    const recipes = await Recipe.query().select('*').where(
        'name', 'like', `%${req.query.contains}%`);
    return res.json(recipes);
  }
});

route.post('/', async (req: Request, res: Response) => {
  if (!R.has('body', req) || !R.has('name', req.body)) {
    return res.json({err: 'No ingredient information provided.'});
  }
  const name: string = req.body.name.trim().toLowerCase();
  if (R.isEmpty(name)) {
    return res.json({err: 'Empty recipe name.'});
  }

  const hasName = await Recipe.query().select('*').where({name});
  if (!R.isEmpty(hasName)) {
    return res.json({err: 'Recipe already registered.'});
  }

  let cookingMethod: string = req.body.cookingMethod;
  if (!R.isNil(cookingMethod)) {
    cookingMethod = cookingMethod.trim().toLowerCase();
  }

  const ingredientsId: number[] = req.body.ingredients || [];
  const ingredients: Ingredient[] =
      await Ingredient.query().select('*').whereIn('id', ingredientsId);

  const recipes = await Recipe.query()
                      .insert({name, cookingMethod, ingredients})
                      .skipUndefined();

  return res.json(recipes);
});
