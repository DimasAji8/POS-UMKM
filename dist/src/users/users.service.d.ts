import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserStatusDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }>;
    updateStatus(id: string, updateUserStatusDto: UpdateUserStatusDto): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    resetPassword(id: string): Promise<{
        id: string;
        username: string;
        name: string;
    }>;
}
