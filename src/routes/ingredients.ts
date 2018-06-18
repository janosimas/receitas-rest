import {Request, Response, Router} from 'express';
import R from 'ramda';

import {Ingredient} from '../models/ingredients';

export const route = Router();
route.get('/', (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of ingredients

    res.json({ingredients: 'ingredients'});
  } else {
    // autocomplete
    res.json({});
  }
});

route.post('/new', async (req: Request, res: Response) => {
  if (!R.has('body', req) || !R.has('name', req.body)) {
    return res.json({err: 'No ingredient information provided.'});
  }
  const name: string = req.body.name.trim();
  if (R.isEmpty(name)) {
    return res.json({err: 'Empty ingredient name.'});
  }
  const hasName = await Ingredient.query().select('*').where({name});
  if (!R.isEmpty(hasName)) {
    return res.json({err: 'Ingredient already registered.'});
  }

  const ingredient = await Ingredient.query().insert({name});

  return res.json(ingredient);
});
