import { Router } from 'express';
import UsersController from './controllers/UsersController';

const routes = Router();

routes.get('/users', UsersController.getUsers);
routes.post('/users', UsersController.saveUser);
routes.delete('/users/:id', UsersController.deleteUser);
routes.put('/users/:id', UsersController.updateUser);

export default routes;