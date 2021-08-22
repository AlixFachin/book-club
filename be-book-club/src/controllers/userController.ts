// userController

import express, {Router, Response, Request, NextFunction } from "express";
import { nextTick } from "process";
import { User } from "../Entities";
import {UserServices } from "../services/userServices";

export class UserController {
    public router: Router;
    public userServices: UserServices;

    constructor() {
        this.router = Router();
        this.router.use(express.json());
        this.userServices = new UserServices();
        this.registerRoutes();
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const allUsers = await this.userServices.getAll();
            res.status(200).send(allUsers);
        } catch(err) {
            next(err);
        }
    };

    public getOne = async(req: Request, res: Response, next: NextFunction) => {
        try {   
            const { userId } = req.params;
            const queriedUser = await this.userServices.getOne(userId);
            if (queriedUser) {
                res.status(200).send(queriedUser);
            } else {
                res.status(404).end();
            }
        } catch(err) {
            next(err);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newUserParams = req['body'] as User;
            const newUser = await this.userServices.create(newUserParams);
            if (newUser) {
                res.status(201).send(newUser);
            } else {
                res.status(400).end();
            }
        } catch (err) {
            next(err);
        }
    }

    public registerRoutes() : void {
        this.router.get('/', this.getAll);
        this.router.get('/:userId', this.getOne);
        this.router.post('/', this.create);
    }

}