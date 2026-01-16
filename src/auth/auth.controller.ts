import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, UbahKataSandiDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Autentikasi')
@Controller('autentikasi')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login pengguna',
    description: 'Endpoint untuk login ke sistem. Dapat diakses oleh ADMIN dan KASIR.',
  })
  @ApiResponse({ status: 200, description: 'Login berhasil, mengembalikan access token' })
  @ApiResponse({ status: 401, description: 'Username atau kata sandi salah' })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login berhasil',
      data: {
        user: result.pengguna,
        token: result.accessToken,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout pengguna' })
  logout() {
    return {
      success: true,
      message: 'Logout berhasil',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profil')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lihat profil pengguna',
    description: 'Mengambil data profil pengguna yang sedang login. Dapat diakses oleh ADMIN dan KASIR.',
  })
  @ApiResponse({ status: 200, description: 'Data profil pengguna' })
  @ApiResponse({ status: 401, description: 'Token tidak valid atau kadaluarsa' })
  ambilProfil(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ubah kata sandi',
    description: 'Mengubah kata sandi pengguna yang sedang login. Dapat diakses oleh ADMIN dan KASIR.',
  })
  @ApiResponse({ status: 200, description: 'Kata sandi berhasil diubah' })
  @ApiResponse({ status: 400, description: 'Kata sandi saat ini salah' })
  @ApiResponse({ status: 401, description: 'Token tidak valid atau kadaluarsa' })
  async ubahKataSandi(@Request() req, @Body() ubahKataSandiDto: UbahKataSandiDto) {
    await this.authService.ubahKataSandi(req.user.id, ubahKataSandiDto);
    return {
      success: true,
      message: 'Password berhasil diubah',
    };
  }
}
