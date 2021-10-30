import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodoService } from './services/todo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoController } from './controllers/todo.controller';
import { TodoRepository } from './repositories/todo.repository';
import { User, UserSchema } from './schemas/user.schema';
import { Team, TeamSchema } from './schemas/team.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL),
    MongooseModule.forFeatureAsync([
      {
        name: Todo.name,
        useFactory: () => {
          const schema = TodoSchema;
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
          schema.pre('save', function (next) {
            if (this.isNew) {
              throw new Error('this schema is read-only');
            } else {
              next();
            }
          });
          return schema;
        },
      },
      {
        name: Team.name,
        useFactory: () => {
          const schema = TeamSchema;
          schema.pre('save', function (next) {
            if (this.isNew) {
              throw new Error('this schema is read-only');
            } else {
              next();
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
        name: 'TEAM_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          noAck: false,
          queue: 'team_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
  exports: [TodoRepository],
})
export class AppModule {}
