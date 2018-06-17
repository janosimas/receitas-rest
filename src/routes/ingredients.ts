import { Express, Response, Request, Router } from "express";
import { Ingredient, IngredientName } from "../models/ingredients";
import R from 'ramda';

const route = Router();
route.get('/', (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of ingredients

    res.json({ ingredients: 'ingredients' });
  } else {
    // autocomplete
    res.json({});
  }
});

route.post('/new', async (req: Request, res: Response) => {
  if (!R.has('body', req)
    || !R.has('name', req.body)) {
    return res.json({
      err: 'No ingredient information provided.'
    });
  }
  const name: string = req.body.name.trim();
  if (R.isEmpty(name)) {
    return res.json({
      err: 'Invalid ingredient name.'
    });
  }
  const hasName = await IngredientName
    .query()
    .select('*')
    .where({ name: name });
  if (!R.isEmpty(hasName)) {
    return res.json({
      err: 'Empty ingredient name.'
    });
  }

  const ingredient = await Ingredient
    .query()
    .insert({});
  IngredientName
    .query()
    .insert({
      ingredientId: ingredient.id,
      name: name
    });

  return res.json(ingredient);
});

export default (app: Express) => {
  app.use('/ingredients', route);
}