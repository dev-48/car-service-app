import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/v1/auth/auth.module';
import { UsersModule } from './api/v1/users/users.module';
import { user } from './entities/user.entity';
import { token } from './entities/token.entity';
import { AdminMiddleware } from './middlewares/admin.middleware';
import { CarsModule } from './api/v1/cars/cars.module';
import { ApplicationsModule } from './api/v1/applications/applications.module';
import { StaffMiddleware } from './middlewares/staff.middleware';
import { ManagerMiddleware } from './middlewares/manager.middleware';
import { ToolsModule } from './api/v1/tools/tools.module';
import { MechanicsMiddleware } from './middlewares/mechanics.middleware';

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
    CarsModule,
    ApplicationsModule,
    ToolsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('api/v1/users');
    consumer.apply(AdminMiddleware).forRoutes('api/v1/applications/delete');
    consumer.apply(AdminMiddleware).forRoutes('api/v1/applications/edit');
    consumer.apply(StaffMiddleware).forRoutes('api/v1/applications/change');
    consumer
      .apply(ManagerMiddleware)
      .forRoutes('api/v1/applications/change/executor');
    consumer
      .apply(ManagerMiddleware)
      .forRoutes('api/v1/applications/staff/mechanics');
    consumer.apply(MechanicsMiddleware).forRoutes('api/v1/tools');
  }
}
