import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interface/valid-roles';

export const META_ROLES = 'roles'; //esto es para que no se repita el string en el decorador y en el guardia

export const RoleProtected = (...args: ValidRoles[]) => 
{
    return SetMetadata(META_ROLES, args);
}
