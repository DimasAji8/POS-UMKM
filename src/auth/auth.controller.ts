import { Controller, Post, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, UbahKataSandiDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login pengguna' })
  @ApiResponse({ status: 200, description: 'Login berhasil' })
  @ApiResponse({ status: 401, description: 'Kredensial tidak valid' })
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
  @ApiOperation({ summary: 'Ambil profil pengguna saat ini' })
  ambilProfil(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ubah kata sandi pengguna' })
  async ubahKataSandi(@Request() req, @Body() ubahKataSandiDto: UbahKataSandiDto) {
    await this.authService.ubahKataSandi(req.user.id, ubahKataSandiDto);
    return {
      success: true,
      message: 'Password berhasil diubah',
    };
  }
}
