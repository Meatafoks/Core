import { ComponentUndefinedError, MetafoksRegistry } from '../../src';

describe('container disable testing', () => {
    class Foo {
        value = 'bar';
    }

    beforeEach(() => MetafoksRegistry.getDefaultContainer().clear());

    it('should disable item id from container', () => {
        const container = MetafoksRegistry.getDefaultContainer();

        container.registerClass(Foo);
        expect(container.has(Foo)).toBeTruthy();
        expect(container.resolve(Foo).value).toEqual('bar');

        container.dispose(Foo);
        expect(container.has(Foo)).toBeFalsy();

        container.disable(Foo);
        container.registerClass(Foo);
        expect(container.has(Foo)).toBeFalsy();
    });

    it('should disable item id and dispose it', () => {
        const container = MetafoksRegistry.getDefaultContainer();

        container.registerClass(Foo);
        expect(container.has(Foo)).toBeTruthy();
        expect(container.resolve(Foo).value).toEqual('bar');

        container.disable(Foo, true);
        expect(container.has(Foo)).toBeFalsy();
        expect(container.isEnabledRegistrationFor(Foo)).toBeFalsy();
    });
});
