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
Object.defineProperty(exports, "__esModule", { value: true });
// Require the dev-dependencies
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const recipeModel_1 = require("../models/recipeModel");
const server_1 = require("../server");
process.env.NODE_ENV = 'test';
const should = chai_1.default.should();
chai_1.default.use(chai_http_1.default);
describe('recipes', () => {
    before(() => __awaiter(this, void 0, void 0, function* () {
        yield recipeModel_1.RecipeModel.query().delete();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield recipeModel_1.RecipeModel.query().delete();
    }));
    const nameUpper = 'Tomato Salad';
    const nameLower = nameUpper.toLowerCase();
    const ingredientsUpper = ['Cenoura ', 'Tomate', 'oregano'];
    const ingredientsLower = [{ name: 'cenoura' }, { name: 'tomate' }, { name: 'oregano' }];
    describe('/POST recipes', () => __awaiter(this, void 0, void 0, function* () {
        it('Register a new recipe with no ingredients.', (done) => {
            chai_1.default.request(server_1.server)
                .post('/recipe')
                .send({ name: nameUpper })
                .end((err, res) => {
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
            chai_1.default.request(server_1.server)
                .post('/recipe')
                .send({ name: nameUpper, ingredients: ingredientsUpper })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('id');
                res.body.name.should.be.eql(nameLower);
                res.body.ingredients.should.be.eql(ingredientsLower);
                done();
            });
        });
        it('Register a same recipe twice.', (done) => {
            chai_1.default.request(server_1.server)
                .post('/recipe')
                .send({ name: nameUpper })
                .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('id');
                res.body.name.should.be.eql(nameLower);
                chai_1.default.request(server_1.server)
                    .post('/recipe')
                    .send({ name: nameUpper })
                    .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('err');
                    res.body.err.should.be.equal('Recipe already registered.');
                    done();
                });
            });
        });
        it('List recipes.', (done) => {
            chai_1.default.request(server_1.server).get('/recipe/list').end((err, res) => {
                const body = res.body;
                body.should.be.an('array').that.have.lengthOf(0);
                chai_1.default.request(server_1.server)
                    .post('/recipe')
                    .send({ name: nameUpper })
                    .end((err, res) => {
                    chai_1.default.request(server_1.server).get('/recipe/list').end((err, res) => {
                        const body = res.body;
                        body.should.have.lengthOf(1);
                        body[0].should.have.property('name');
                        body[0].name.should.be.equal(nameLower);
                        done();
                    });
                });
            });
        });
    }));
});
//# sourceMappingURL=recipes.specs.js.map