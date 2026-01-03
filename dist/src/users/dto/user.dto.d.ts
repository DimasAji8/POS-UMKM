import { Role } from '@prisma/client';
export declare class CreateUserDto {
    name: string;
    username: string;
    password: string;
    role: Role;
}
export declare class UpdateUserStatusDto {
    isActive?: boolean;
}
