import { AuthService } from './auth.service';
import { LoginDto, UbahKataSandiDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        pengguna: {
            id: string;
            nama: string;
            username: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    ambilProfil(req: any): any;
    ubahKataSandi(req: any, ubahKataSandiDto: UbahKataSandiDto): Promise<{
        pesan: string;
    }>;
}
