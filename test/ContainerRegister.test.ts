import { MetafoksContainer } from '../src/container/MetafoksContainer';

describe('container registrations tests', () => {
    it('should register class', () => {
        class Test {
            value = 12;
        }

        const container = new MetafoksContainer('test');
        container.registerClass(Test);

        const test = container.resolve(Test);
        expect(test.value).toEqual(12);
    });

    it('should register function', () => {
        const fn = () => {
            return 15;
        };

        const container = new MetafoksContainer('test');
        container.registerFunction('fn', fn);

        const test = container.resolve<number>('fn');
        expect(test).toEqual(15);
    });

    it('should register object', () => {
        const obj = { foo: 'bar' };

        const container = new MetafoksContainer('test');
        container.registerValue('obj', obj);

        const test = container.resolve<typeof obj>('obj');
        expect(test.foo).toEqual('bar');
    });
});
