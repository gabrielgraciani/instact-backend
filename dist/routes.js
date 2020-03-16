"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var UsersController_1 = __importDefault(require("./controllers/UsersController"));
var routes = express_1.Router();
routes.get('/users', UsersController_1.default.getUsers);
routes.post('/users', UsersController_1.default.saveUser);
routes.delete('/users/:id', UsersController_1.default.deleteUser);
routes.put('/users/:id', UsersController_1.default.updateUser);
exports.default = routes;
