import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileMiddleware } from './profile.middleware';
import { OrdersController } from 'src/orders/orders.controller';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService]
})
export class ProfileModule implements NestModule  {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(ProfileMiddleware)
            .forRoutes(
                ProfileController,
                OrdersController,
                {path:'auth/logout',method:RequestMethod.ALL}
            )
    }
}