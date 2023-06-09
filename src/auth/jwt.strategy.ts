import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // You can add additional validation logic here
    // If everything is fine, return payload / User
    // If anything fails, throw UnauthorizedException
    if (payload) {
      return { ...payload, id: payload.sub };
    } else {
      throw new UnauthorizedException();
    }
  }
}
