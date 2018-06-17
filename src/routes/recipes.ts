import { Express, Response, Request } from "express";

export default (app: Express) => {
  app.get('/recipes', (req: Request, res: Response) => {
    if (!req.query.contains) {
      // full list of recipes

      res.json({ recipes: 'recipes' });
    } else {
      // autocomplete
      res.json({});
    }
  });
}