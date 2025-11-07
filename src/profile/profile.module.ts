import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileMiddleware } from './profile.middleware';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService]
})
export class ProfileModule implements NestModule  {
    configure(consumer:MiddlewareConsumer){
        consumer
            .apply(ProfileMiddleware)
            .forRoutes(
                ProfileController
            )
    }
}