import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UpdateProfileDto } from '../auth/dto/profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private authService: AuthService) {}

  @Get()
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      name: req.user.nama,
      role: req.user.role,
      email: req.user.email || '',
      createdAt: req.user.dibuatPada,
    };
  }

  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.authService.updateProfile(req.user.id, updateProfileDto);
    return {
      success: true,
      message: 'Profil berhasil diupdate',
      data,
    };
  }
}
