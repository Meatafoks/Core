import { ComponentUndefinedError, MetafoksRegistry } from '../../src';

describe('container remove testing', () => {
    it('should remove item from container', () => {
        const container = MetafoksRegistry.getDefaultContainer();

        container.registerValue('test', 1);
        expect(container.resolve('test')).toEqual(1);

        container.dispose('test');
        expect(() => container.resolve('test')).toThrow(ComponentUndefinedError);
    });
});
