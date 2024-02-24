import { COMPONENT_NOT_INITED, Inject, MetafoksContainer, Value } from '../../src';

function Foo(target: any) {}

class ValueA {
    value = 'a';
}

class ValueB {
    value = 'b';
}

@Foo
class TestCase1 {
    @Inject(ValueA)
    private varACustom!: ValueA;

    public constructor(
        private varA: ValueA,
        private varB: ValueB,
    ) {}

    public getResult() {
        return this.varA.value + this.varB.value + this.varACustom.value;
    }
}

describe('resolve different tests', () => {
    const container = MetafoksContainer.default;
    const components = container['metadataMap'];

    beforeEach(() => {
        container.clear();

        container.registerClass(ValueA);
        container.registerClass(ValueB);
    });

    it('should resolve all values by constructor', () => {
        container.registerClass(TestCase1);

        expect(container.has(ValueA)).toBeTruthy();

        const component = components.get(TestCase1)!;
        expect(component.type).toEqual(TestCase1);
        expect(component.value).toEqual(COMPONENT_NOT_INITED);

        const resolved = container.resolve(TestCase1);
        expect(resolved.getResult()).toEqual('aba');
    });
});
