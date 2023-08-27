import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, FindUserDto } from 'src/dtos';
import { User } from 'src/typeorm/entities/User';
import { Tokens } from 'src/types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ATGuard, RTGuard } from 'src/common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
    constructor(private aouthService: AuthService) { }

    @Public()
    @Post('/local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> { 
        return this.aouthService.signup(createUserDto)
    }

    @Public()
    @Post('/local/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() findUserDto: FindUserDto): Promise<Tokens> { 
        return this.aouthService.signin(findUserDto)
    }

    @UseGuards(ATGuard)
    @Post('/signout')
    @HttpCode(HttpStatus.OK)
    signout(@GetCurrentUserId() id: number) {
        return this.aouthService.signout(id)
    }

    @Public()
    @UseGuards(RTGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refresh(
        @GetCurrentUser('refreshToken') refreshToken: string,
        @GetCurrentUserId() id: FindUserDto
    ) { 
        console.log(refreshToken)
        return this.aouthService.refresh(id, refreshToken)
    }
}
