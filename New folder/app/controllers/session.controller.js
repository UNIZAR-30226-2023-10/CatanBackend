import db from '../models/index.js'
import UserModel from '../models/user.model.js'
import { jwt_secret } from '../config/jwt.config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const Session = {
    async login(req, res) {
        res.json(
            {
                "Title": "Login"
            }
        );
    },
}

export default Session