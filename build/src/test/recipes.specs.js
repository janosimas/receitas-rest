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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Require the dev-dependencies
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const RecipeModel_1 = require("../models/RecipeModel");
process.env.NODE_ENV = 'test';
// import { restServer } from '../restServer';
const typeorm_1 = require("typeorm");
const IngredientModel_1 = require("../models/IngredientModel");
const server_1 = require("../server");
const R = __importStar(require("ramda"));
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
describe('recipes', () => {
    let restServer;
    before(() => __awaiter(this, void 0, void 0, function* () {
        restServer = yield server_1.server;
        yield clearDatabase();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    const nameUpper = 'Tomato Salad';
    const nameLower = nameUpper.toLowerCase();
    const ingredientsUpper = [{ name: 'Cenoura' }, { name: 'Tomate' }, { name: 'oregano' }];
    const ingredientsLower = [{ name: 'cenoura' }, { name: 'oregano' }, { name: 'tomate' }];
    describe('/POST recipes', () => __awaiter(this, void 0, void 0, function* () {
        it('Register a new recipe with no ingredients.', (done) => {
            chai_1.default.request(restServer)
                .post('/recipe')
                .send({ name: nameUpper })
                .end((err, res) => {
                if (err) {
                    console.error(err);
                    return done();
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('id');
                res.body.name.should.be.eql(nameLower);
                done();
            });
        });
        it('Register a new recipe with ingredients.', (done) => {
            chai_1.default.request(restServer)
                .post('/recipe')
                .send({ name: nameUpper, ingredients: ingredientsUpper })
                .end((err, res) => {
                if (err) {
                    console.error(err);
                    return done();
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('id');
                res.body.name.should.be.eql(nameLower);
                let returnedIngredients = res.body.ingredients;
                returnedIngredients = R.sortBy(R.prop('name'))(returnedIngredients);
                Promise
                    .all(returnedIngredients.map((ingredient, index) => ingredient.name.should.be.equal(ingredientsLower[index].name)))
                    .then(() => done());
            });
        });
        it('Register a same recipe twice.', (done) => {
            chai_1.default.request(restServer)
                .post('/recipe')
                .send({ name: nameUpper })
                .end((err, res) => {
                if (err) {
                    console.error(err);
                    return done();
                }
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('id');
                res.body.name.should.be.eql(nameLower);
                chai_1.default.request(restServer)
                    .post('/recipe')
                    .send({ name: nameUpper })
                    .end((err, res) => {
                    if (err) {
                        console.error(err);
                        return done();
                    }
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('err');
                    res.body.err.should.be.equal('Recipe already registered.');
                    done();
                });
            });
        });
        it('List recipes.', (done) => {
            chai_1.default.request(restServer).get('/recipe/list').end((err, res) => {
                const body = res.body;
                body.should.be.an('array').that.have.lengthOf(0);
                chai_1.default.request(restServer)
                    .post('/recipe')
                    .send({ name: nameUpper, ingredients: ingredientsUpper })
                    .end((err, res) => {
                    chai_1.default.request(restServer).get('/recipe/list').end((err, res) => {
                        const body = res.body;
                        body.should.have.lengthOf(1);
                        body[0].should.have.property('name');
                        body[0].name.should.be.equal(nameLower);
                        let returnedIngredients = body[0].ingredients;
                        returnedIngredients =
                            R.sortBy(R.prop('name'))(returnedIngredients);
                        Promise
                            .all(returnedIngredients.map((ingredient, index) => ingredient.name.should.be.equal(ingredientsLower[index].name)))
                            .then(() => done());
                    });
                });
            });
        });
    }));
});
const clearDatabase = () => __awaiter(this, void 0, void 0, function* () {
    const ingredientsRepository = typeorm_1.getConnection().getRepository(IngredientModel_1.IngredientModel);
    const ingredients = yield ingredientsRepository.find();
    yield Promise.all(ingredients.map(ingredients => ingredientsRepository.remove(ingredients)));
    const recipeRepository = typeorm_1.getConnection().getRepository(RecipeModel_1.RecipeModel);
    const recipes = yield recipeRepository.find();
    yield Promise.all(recipes.map(recipe => recipeRepository.remove(recipe)));
});
//# sourceMappingURL=recipes.specs.js.map