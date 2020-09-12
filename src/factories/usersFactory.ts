import User from '../schemas/user/user';
import Factory from './factory';

export default class UsersFactory extends Factory<User>{
    createItem(userObject:any):User{
        return new User(userObject);
    }
}

