import {Request, Response, Router} from 'express';

export const route = Router();

route.get('/', (req: Request, res: Response) => {
  if (!req.query.contains) {
    // full list of recipes

    res.json({recipes: 'recipes'});
  } else {
    // autocomplete
    res.json({});
  }
});
