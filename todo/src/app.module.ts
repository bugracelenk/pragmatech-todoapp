import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { TodoService } from './services/todo.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TodoController } from './controllers/todo.controller';

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
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_HOST],
          noAck: false,
          queue: 'user_queue',
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
  providers: [TodoService],
})
export class AppModule {}
