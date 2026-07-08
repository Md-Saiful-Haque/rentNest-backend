import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { IRegisterUser, IUserLogin } from "./auth.interface"
import bcrypt from "bcryptjs";


const createUserIntoDB = async (payload: IRegisterUser) => {
    const { name, email, password, phone, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: { email }
    });
    if (isUserExist) {
        throw new Error('User with this email already exists');
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role,
            phone
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email
        },
        omit: {
            password: true
        }
    });
    return user;
}

const logUser = async (payload: IUserLogin) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email
        }
    });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error('password is incorrect');
    }

    if (user.status === 'BANNED') {
        throw new Error('Your account has been banned. Please contact support');
    }

    // jwt payload
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };
    // accessToken
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );
    return {
        accessToken,
        refreshToken
    };
};




export const authService = {
    createUserIntoDB
}