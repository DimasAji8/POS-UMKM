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
exports.UbahKataSandiDto = exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin' }),
    (0, class_validator_1.IsString)({ message: 'Username harus berupa teks' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username tidak boleh kosong' }),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin123' }),
    (0, class_validator_1.IsString)({ message: 'Kata sandi harus berupa teks' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kata sandi tidak boleh kosong' }),
    __metadata("design:type", String)
], LoginDto.prototype, "kataSandi", void 0);
class UbahKataSandiDto {
}
exports.UbahKataSandiDto = UbahKataSandiDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({ message: 'Kata sandi saat ini harus berupa teks' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kata sandi saat ini tidak boleh kosong' }),
    __metadata("design:type", String)
], UbahKataSandiDto.prototype, "kataSandiSaatIni", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)({ message: 'Kata sandi baru harus berupa teks' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kata sandi baru tidak boleh kosong' }),
    __metadata("design:type", String)
], UbahKataSandiDto.prototype, "kataSandiBaru", void 0);
//# sourceMappingURL=auth.dto.js.map