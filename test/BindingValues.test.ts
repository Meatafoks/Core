import { Autowire, Binding, Component, MetafoksContainer, Value } from '../src';

describe('test some bindings', () => {
    it('should all binding works', () => {
        class TestEx {
            public value: number = 0;
        }

        @Component
        class Configurator {
            @Binding(TestEx)
            createTest() {
                const test = new TestEx();
                test.value = 15;
                return test;
            }

            @Binding('config')
            createConfig() {
                return { kek: 33 };
            }
        }

        @Component
        class App {
            @Autowire
            public testEx!: TestEx;

            @Value('config')
            public cfg: any;

            public getTestEx() {
                return this.testEx.value;
            }

            public getConfig() {
                return this.cfg.kek;
            }
        }

        const app = MetafoksContainer.default.resolve(App);

        expect(app.getTestEx()).toEqual(15);
        expect(app.getConfig()).toEqual(33);
    });
});
