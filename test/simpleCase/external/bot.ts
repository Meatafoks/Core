import { Component } from '../../../src/decorators/Component';
import { TelegramAPI } from './telegram';
import { Autowire } from '../../../src/decorators/Autowire';

@Component
export class Bot {
    @Autowire
    public api!: TelegramAPI;

    public start() {
        this.api.start();
    }
}
