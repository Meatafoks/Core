import { Component } from '../src/decorators/Component';
import { MetafoksContainer } from '../src/container/MetafoksContainer';
import { Autowire } from '../src/decorators/Autowire';
import { Bind } from '../src/decorators/Bind';
import { MetafoksLogger } from '@metafoks/logger';

describe('binding test', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false });
    MetafoksLogger.global.overrideLevelProperties({ app: 'debug' });

    class Test {
        constructor(public value: number) {}
    }

    @Component
    class Configurator {
        private val = 10;

        @Bind
        public createSomeTest(): Test {
            return new Test(10 + this.val);
        }
    }

    @Component
    class App {
        @Autowire
        private readonly test!: Test;

        public getResult() {
            return this.test.value;
        }
    }

    it('should works', () => {
        const app = MetafoksContainer.default.resolve(App);
        expect(app.getResult()).toEqual(20);
    });
});
