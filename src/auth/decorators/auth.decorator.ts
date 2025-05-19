import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../interface/valid-roles";
import { RoleProtected } from "./role-protected/role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";


export function Auth(...roles:ValidRoles[]){
    return applyDecorators(
        RoleProtected(...roles), //esto es para que no se repita el string en el decorador y en el guardia
        UseGuards(AuthGuard(), UserRoleGuard), //se recomienda no crear instancias de guardias
        
    )
}