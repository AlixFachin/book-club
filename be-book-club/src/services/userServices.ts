// userServices
// This class will define everything related with the database relations

import { getConnection } from "typeorm";
import { User, UserRepository } from "../Entities";

export class UserServices {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = getConnection().getRepository(User);
    }

    public getAll = async () => {
        const allUsers = await this.userRepository.find();
        return allUsers;
    }

    public getOne = async (userId: string) => {
        try {
            const requestedUser = await this.userRepository.findOne(userId);
            return requestedUser;
        } catch(err) {
            return undefined;
        }
    }

    public create = async (userDetails: Omit<User, "id">) : Promise<User | undefined> => {
        try {
            let newUser = new User();
            newUser = { ...newUser, ...userDetails};
            return await this.userRepository.save(newUser);
        } catch(error) {
            return undefined;
        }
    }

    public update = async (userId: string, updateDetails: Partial<User>) => {
        try {
            await this.userRepository.update(userId, updateDetails);
            const modifiedUser = await this.userRepository.findOne(userId);
            return modifiedUser;
        } catch (err) {
            return undefined;
        }
    }

    public delete = async (deletedId: string) : Promise<User | undefined> => {
        const toBeDeleted = await this.userRepository.findOne(deletedId);
        if (toBeDeleted) {
            const delResult = await this.userRepository.delete(deletedId);
            if (delResult.affected && delResult.affected === 1) {
                return toBeDeleted;
            } 
        } 
        return undefined;
    }

}