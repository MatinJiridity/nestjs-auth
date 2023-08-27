import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto } from 'src/dtos';
import { User } from 'src/typeorm/entities/User';
import { Tokens } from 'src/types';
import { UsersService } from 'src/users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User) private usersRepository: Repository<User>
    ) { }

    async encrypt(data: string): Promise<string> {
        return await bcrypt.hash(data, 10);
    }

    async sign(id: number, email: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({ sub: id, email }, { expiresIn: 60 * 60, secret: 'at-secret' }),
            this.jwtService.signAsync({ sub: id, email }, { expiresIn: 60 * 60 * 24 * 7, secret: 'rt-secret' })
        ]);

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    async signup(createUserDto: CreateUserDto): Promise<Tokens> {
        const user = await this.usersService.createUser({ password: await this.encrypt(createUserDto.password), email: createUserDto.email });
        const tokens = await this.sign(user.id, user.email);
        await this.updateHashedRt(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateHashedRt(id: number, rt: string) {
        const hash = await this.encrypt(rt);
        await this.usersRepository.update({ id }, { hashRt: hash });
    }

    async signin(findUserDto: FindUserDto): Promise<Tokens> {
        const user = await this.usersService.findUser(findUserDto);
        if (!user) throw new ForbiddenException('Access Denied!');
        const passwordMatches = await bcrypt.compare(findUserDto.password, user.password);
        if (!passwordMatches) throw new ForbiddenException('Access Denied!');
        const tokens = await this.sign(user.id, user.email);
        await this.updateHashedRt(user.id, tokens.refresh_token);
        return tokens;
    }

    // get user id from token so need jwt
    async signout(id: number) {
        const user = await this.usersRepository.findOne({where: {id, hashRt: Not(IsNull())}});
        if (!user) throw new ForbiddenException('Unauthorised!');
        await this.usersRepository.update({ id: user.id }, { hashRt: null });
    }

    async refresh(findUserDto: FindUserDto, rt: string): Promise<Tokens> {
        const user = await this.usersService.findUser(findUserDto);
        if (!user) throw new ForbiddenException('Access Denied!');
        const rtMatches = await bcrypt.compare(rt, user.hashRt);
        if (!rtMatches) throw new ForbiddenException('Access Denied!');
        const tokens = await this.sign(user.id, user.email);
        await this.updateHashedRt(user.id, tokens.refresh_token);
        return tokens;
    }

}
