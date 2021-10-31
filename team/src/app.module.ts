import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamController } from './controllers/team.controller';
import { TeamRepository } from './repositories/team.repository';
import { TeamService } from './services/team.service';
import { Team, TeamSchema } from './schemas/team.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User, UserSchema } from './schemas/user.schema';
import { Todo, TodoSchema } from './schemas/todo.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL),
    MongooseModule.forFeatureAsync([
      {
        name: Team.name,
        useFactory: () => {
          const schema = TeamSchema;
          schema.pre('save', function () {
            if (this.isNew) {
              const objId = this._id;
              this.id = objId;
            }
          });
          return schema;
        },
      },
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            if (this.isNew) {
              throw new Error('this schema for read-only');
            }
          });
          return schema;
        },
      },
      {
        name: Todo.name,
        useFactory: () => {
          const schema = TodoSchema;
          schema.pre('save', function () {
            if (this.isNew) {
              throw new Error('this schema for read-only');
            }
          });
          return schema;
        },
      },
    ]),
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
    ]),
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamRepository],
})
export class AppModule {}
