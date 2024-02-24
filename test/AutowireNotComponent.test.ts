import { Component } from '../src/decorators/Component';
import { MetafoksContainer } from '../src/container/MetafoksContainer';
import { MetafoksLogger } from '@metafoks/logger';
import { ComponentUndefinedError } from '../src/errors/ComponentUndefinedError';
import { Autowire } from '../src/decorators/Autowire';

describe('try autowire not component type', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false });
    MetafoksLogger.global.overrideLevelProperties({ app: 'debug' });

    class TestA {
        public value = 15;
    }

    @Component
    class App {
        @Autowire
        private clazz!: TestA;

        getResult() {
            return this.clazz.value;
        }
    }

    it('should throw undefined component error', () => {
        const app = MetafoksContainer.default.resolve(App);
        expect(() => app.getResult()).toThrowError(ComponentUndefinedError);
    });
});
