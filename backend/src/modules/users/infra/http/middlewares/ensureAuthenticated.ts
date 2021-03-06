import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token is required', 401);
    }

    const [, token] = authHeader.split(' ');

    const { secret } = authConfig.jwt;

    try {
        const decoded = verify(token, secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Invalid token', 401);
    }
}

export default ensureAuthenticated;
