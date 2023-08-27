import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserDto, FindUserDto,  } from 'src/dtos';
import { Tokens } from 'src/types';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>){}

    createUser(createUserDto: CreateUserDto) : Promise<User> {
        const {password} = createUserDto;
        const newUser = this.usersRepository.create({
            ...createUserDto,
            password,
            createAt: new Date(),
        });
        console.table({newUser})
        return this.usersRepository.save(newUser);
    }

    findUser(findUserDto: FindUserDto) {
        if(findUserDto.email)
            return this.usersRepository.findOneBy({email: findUserDto.email});
        if(findUserDto.id)
            return this.usersRepository.findOneBy({id: findUserDto.id});
    }

}
