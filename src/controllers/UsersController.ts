import { Request, Response } from 'express';
import usersData from '../data/users.json';
import path from 'path';
import fs from 'fs';
const filePath = '../data/users.json';

export default {
    async getUsers(req: Request, res: Response){
        return res.json(usersData);
    },

    async saveUser(req: Request, res: Response){
        const user = req.body;
        usersData.push(user);

        const pathToFile = path.join(__dirname, filePath);
        const stringifiedData = JSON.stringify(usersData, null, 2);

        fs.writeFile(pathToFile, stringifiedData, (err) => {
            if(err){
                return res.status(422).send(err);
            }
            return res.json('User adicionado com sucesso!');
        });
    },

    async deleteUser(req: Request, res: Response){
        const {id} = req.params;
        const userIndex = usersData.findIndex(i => i.id === id);

        if(userIndex === -1){
            return res.json('User não encontrado');
        }

        usersData.splice(userIndex, 1);

        const pathToFile = path.join(__dirname, filePath);
        const stringifiedData = JSON.stringify(usersData, null, 2);

        fs.writeFile(pathToFile, stringifiedData, (err) => {
            if(err){
                return res.status(422).send(err);
            }
            return res.json('User deletado com sucesso!');
        });
    },

    async updateUser(req: Request, res: Response){
        const {id} = req.params;
        const user = req.body;
        const userIndex = usersData.findIndex(i => i.id === id);

        if(userIndex === -1){
            return res.json('User não encontrado');
        }

        usersData[userIndex] = user;

        const pathToFile = path.join(__dirname, filePath);
        const stringifiedData = JSON.stringify(usersData, null, 2);

        fs.writeFile(pathToFile, stringifiedData, (err) => {
            if(err){
                return res.status(422).send(err);
            }
            return res.json("user alterado com sucesso");
        });
    }
};