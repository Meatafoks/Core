import { Component } from '../src/decorators/Component';
import { MetafoksContainer, resolveComponent } from '../src/container/MetafoksContainer';
import { MetafoksLogger } from '@metafoks/logger';
import { Autowire } from '../src/decorators/Autowire';
import { Value } from '../src/decorators/Value';

interface Config {
    value: number;
}

describe('try autowire component type', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false });
    MetafoksLogger.global.overrideLevelProperties({ app: 'debug' });

    MetafoksContainer.default.registerValue<Config>('config', { value: 5 });

    @Component
    class TestA {
        public value = 15;
    }

    class TestB {
        public value = 20;
    }

    @Component
    class App {
        @Autowire
        private clazz!: TestA;

        @Value('config')
        public config!: Config;

        getResult() {
            return this.clazz.value;
        }

        getResultWithConfig() {
            return this.clazz.value + this.config.value;
        }
    }

    it('should get real result', () => {
        const app = resolveComponent(App);
        expect(app.getResult()).toEqual(15);
        expect(app.getResultWithConfig()).toEqual(20);

        MetafoksContainer.default.register(TestA, TestB);
        expect(app.getResult()).toEqual(20);

        MetafoksContainer.default.setProperties({ disableRegistration: ['TestA'] });
        MetafoksContainer.default.register(TestA, TestA);
        expect(app.getResult()).not.toEqual(15);
    });
});
