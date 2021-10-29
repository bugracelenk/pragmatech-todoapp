import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { TeamController } from './controllers/team.controller';
import { TodoController } from './controllers/todo.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: 'user_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TODO_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: 'todo_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'TEAM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          queue: 'team_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '365d' },
      }),
    }),
  ],
  controllers: [AuthController, UserController, TeamController, TodoController],
  providers: [JwtGuard, JwtStrategy],
})
export class AppModule {}
