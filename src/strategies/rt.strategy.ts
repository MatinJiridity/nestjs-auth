import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types';

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'rt-secret',
            passRequestToCallback: true
        })
    }

    validate(req: Request, payload: any) {
        console.log('rt.strategy',req)
        const user = req.get('authorization'); 
        console.log('rt.strategy',user)
        const refreshToken = req
        ?.get('authorization')
        ?.replace('Bearer', '')
        .trim();

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
  
        return {
            ...payload,
            refreshToken
        }
    }

    // validate(payload: JwtPayload) : JwtPayload {
    //     return payload;
    // }
}