import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'http';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Raw } from 'typeorm';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles } from './interface/valid-roles';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

   @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    ) {
      // console.log({user});
    console.log(request);
    return {
      ok: true,
      message: 'Hello world private',
      user,
      userEmail,
      rawHeaders,
    };
  }


//  @SetMetadata('roles',['admin','super-user']) //recordar de poner el set metadata y es mejor crear un custom decorator

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin) //esto es para que no se repita el string en el decorador y en el guardia
  @UseGuards( AuthGuard(), UserRoleGuard ) //se recomienda no crear instancias de guardias
  privateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user,
    };
  }

}
