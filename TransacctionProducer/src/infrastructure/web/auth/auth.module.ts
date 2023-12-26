import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


/**
 * auth module
 */
const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });
@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot(),
    passportModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  exports: [ PassportModule, JwtModule],
})
export class AuthModule {}
