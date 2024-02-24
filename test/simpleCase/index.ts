import { Autowire } from '../../src/decorators/Autowire';
import { Bot } from './external/bot';

export class SimpleApp {
    @Autowire
    private bot!: Bot;

    public start() {
        this.bot.start();
        return this.bot.api.token;
    }
}
