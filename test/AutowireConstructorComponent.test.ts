import { Component } from '../src/decorators/Component';
import { MetafoksContainer } from '../src/container/MetafoksContainer';
import { MetafoksLogger } from '@metafoks/logger';
import { Value } from '../src/decorators/Value';

interface Config {
    value: number;
}

describe('try autowire constructor component type', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false });
    MetafoksLogger.global.overrideLevelProperties({ app: 'debug' });

    @Component
    class TestA {
        public value = 15;
    }

    MetafoksContainer.default.registerValue<Config>('config', { value: 5 });
    MetafoksContainer.default.registerValue<number>('number', 1);

    @Component
    class App {
        @Value('config')
        private config!: Config;

        @Value('number')
        private add!: number;

        public constructor(private clazz: TestA) {}

        getResult() {
            return this.clazz.value + this.config.value + this.add;
        }
    }

    it('should get real result', () => {
        const app = MetafoksContainer.default.resolve(App);
        expect(app.getResult()).toEqual(21);
    });
});
