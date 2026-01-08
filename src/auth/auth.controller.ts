import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
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
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profil')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil profil pengguna saat ini' })
  ambilProfil(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('ubah-kata-sandi')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ubah kata sandi pengguna' })
  async ubahKataSandi(@Request() req, @Body() ubahKataSandiDto: UbahKataSandiDto) {
    return this.authService.ubahKataSandi(req.user.id, ubahKataSandiDto);
  }
}
