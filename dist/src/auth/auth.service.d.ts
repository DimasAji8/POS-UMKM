import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, UbahKataSandiDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        pengguna: {
            id: string;
            nama: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    ubahKataSandi(idPengguna: string, ubahKataSandiDto: UbahKataSandiDto): Promise<{
        pesan: string;
    }>;
}
