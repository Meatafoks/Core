import { COMPONENT_NOT_INITED, MetafoksContainer } from '../../src';
import { MetafoksLogger } from '@metafoks/logger';

describe('register in container test', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false, level: { app: 'debug' } });

    const defaultContainer = MetafoksContainer.default;
    const defaultContainerMap = defaultContainer['metadataMap'];

    beforeEach(() => defaultContainer.clear());

    it('should register function', () => {
        const foo = () => ({ value: 15 });

        defaultContainer.registerFunction('foo', foo);
        const component = defaultContainerMap.get('foo')!;

        expect(component.id).toEqual('foo');
        expect(component.type).toEqual(foo);

        // Before resolve
        expect(component.value).toEqual(COMPONENT_NOT_INITED);

        const resolved = defaultContainer.resolve<ReturnType<typeof foo>>('foo');
        expect(resolved.value).toEqual(15);

        // After resolve
        expect(component.value).toEqual({ value: 15 });
    });

    it('should register class', () => {
        class Foo {
            value = 20;
        }

        defaultContainer.registerClass(Foo);
        const component = defaultContainerMap.get(Foo)!;

        expect(component.id).toEqual(Foo);
        expect(component.type).toEqual(Foo);

        // Before resolve
        expect(component.value).toEqual(COMPONENT_NOT_INITED);

        const resolved = defaultContainer.resolve<Foo>(Foo);
        expect(resolved.value).toEqual(20);

        // After resolve
        expect(component.value).toEqual(new Foo());
    });

    it('should register value', () => {
        const foo = { value: 25 };

        defaultContainer.registerValue('foo', foo);
        const component = defaultContainerMap.get('foo')!;

        expect(component.id).toEqual('foo');
        expect(component.type).toEqual(foo);

        // Before resolve
        expect(component.value).toEqual(COMPONENT_NOT_INITED);

        const resolved = defaultContainer.resolve<typeof foo>('foo');
        expect(resolved.value).toEqual(25);

        // After resolve
        expect(component.value).toEqual({ value: 25 });
    });
});
