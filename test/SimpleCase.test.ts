import { SimpleApp } from './simpleCase';
import { TelegramAPI } from './simpleCase/external/telegram';
import { Bind, Component, MetafoksContainer, resolveComponent } from '../src';

describe('test simple case', () => {
    @Component
    class Configurator {
        @Bind
        createTelegramApi(): TelegramAPI {
            return new TelegramAPI('test-token');
        }
    }

    it('should works', () => {
        MetafoksContainer.default.registerClass(SimpleApp);
        const app = resolveComponent(SimpleApp);

        expect(app.start()).toEqual('test-token');
    });
});
