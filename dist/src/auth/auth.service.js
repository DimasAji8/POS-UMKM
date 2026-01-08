"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const pengguna = await this.prisma.pengguna.findUnique({
            where: { username: loginDto.username },
        });
        if (!pengguna || !pengguna.aktif) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        const kataSandiValid = await bcrypt.compare(loginDto.kataSandi, pengguna.hashKataSandi);
        if (!kataSandiValid) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        const payload = { username: pengguna.username, sub: pengguna.id };
        return {
            accessToken: this.jwtService.sign(payload),
            pengguna: {
                id: pengguna.id,
                nama: pengguna.nama,
                username: pengguna.username,
                role: pengguna.role,
            },
        };
    }
    async ubahKataSandi(idPengguna, ubahKataSandiDto) {
        const pengguna = await this.prisma.pengguna.findUnique({ where: { id: idPengguna } });
        const kataSandiSaatIniValid = await bcrypt.compare(ubahKataSandiDto.kataSandiSaatIni, pengguna.hashKataSandi);
        if (!kataSandiSaatIniValid) {
            throw new common_1.UnauthorizedException('Kata sandi saat ini salah');
        }
        const hashKataSandiBaru = await bcrypt.hash(ubahKataSandiDto.kataSandiBaru, 10);
        await this.prisma.pengguna.update({
            where: { id: idPengguna },
            data: { hashKataSandi: hashKataSandiBaru },
        });
        return { pesan: 'Kata sandi berhasil diubah' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map