import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/v1/auth/auth.module';
import { UsersModule } from './api/v1/users/users.module';
import { user } from './entities/user.entity';
import { token } from './entities/token.entity';
import { AdminMiddleware } from './middlewares/admin.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./src/config/.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([user, token]),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('api/v1/users');
  }
}
