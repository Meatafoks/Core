import { Autowire, Component, ContainerId, Inject, MetafoksRegistry } from '../src';

describe('test cases run', () => {
    it('should success simple case', () => {
        @Component
        class TestA {
            public value = 1;
        }

        @Component
        class TestB {
            @Autowire
            public foo!: TestA;

            public value = 2;

            public getResult() {
                return this.foo.value + this.value;
            }
        }

        const defaultContainer = MetafoksRegistry.getDefaultContainer();
        expect(defaultContainer.has(TestA)).toBeTruthy();
        expect(defaultContainer.has(TestB)).toBeTruthy();

        const test = defaultContainer.resolve(TestB);
        expect(test.getResult()).toEqual(3);
    });

    it('should add to another component', () => {
        @Component
        @ContainerId('test')
        class TestC {
            public value = 1;
        }

        @Component
        @ContainerId('test')
        class TestD {
            @Inject(TestC)
            public foo!: TestD;

            public value = 2;

            public getResult() {
                return this.foo.value + this.value;
            }
        }

        const testContainer = MetafoksRegistry.get('test');
        const defaultContainer = MetafoksRegistry.getDefaultContainer();

        expect(defaultContainer.has(TestC)).not.toBeTruthy();
        expect(defaultContainer.has(TestD)).not.toBeTruthy();
        expect(testContainer.has(TestC)).toBeTruthy();
        expect(testContainer.has(TestD)).toBeTruthy();

        const test = testContainer.resolve(TestD);
        expect(test.getResult()).toEqual(3);
    });
});
