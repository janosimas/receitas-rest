import { Express, Response, Request } from "express";

export default (app: Express) => {
  app.get('/types', (req: Request, res: Response) => {
    res.json({
      cooking_method: [
        'fogão',
        'forno',
        'forno combinado'
      ],
    });
  });
}