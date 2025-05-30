import { createParamDecorator, ExecutionContext, Get, InternalServerErrorException } from '@nestjs/common';
import { ExecException } from 'child_process';
import { create } from 'domain';



export const GetUser = createParamDecorator(
    (data: string,ctx:ExecutionContext)=> {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user)
            throw new InternalServerErrorException('User not found in (request)');  


        return (!data)?user:user[data];
    }


);