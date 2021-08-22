// userController

import express, {Router, Response, Request, NextFunction } from "express";
import {User } from "../Entities";
import {UserServices } from "../services/userServices";

export class UserController {
    public router: Router;
    public userServices: UserServices;

    constructor() {
        this.router = Router();


    }

}