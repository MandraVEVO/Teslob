import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload.interfaces";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from '@nestjs/config';
import { In, Repository } from "typeorm";
import { config } from "process";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService

       
    ){
         const jwtSecret = configService.get('JWT_SECRET');
         if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
         }
         super({
            secretOrKey: jwtSecret, 
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extraer el token del header
        });
    }

    async validate(payload: JwtPayload): Promise<User> { 
//este metodo se va llamar si el JWT no ha expirado y si la fimra de jwt hace match con el payload

        const { email } = payload;
        const user = await this.userRepository.findOneBy({ email });

        if(!user)
            throw new UnauthorizedException('Token not valid');
        if(!user.isActive)
            throw new UnauthorizedException('User is inactive, talk to admin');

        Request
        return user;
    }
}