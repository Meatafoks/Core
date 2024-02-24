import { MetadataUtils } from '../../src/utils';
import { Autowire, Bind } from '../../src';

function Foo(target: any) {}
class ClassA {}
class ClassB {}

describe('get function params types', () => {
    it('should return params types', () => {
        // given
        @Foo
        class A {
            constructor(foo: ClassA, bar: ClassB) {}
        }

        // when
        const params = MetadataUtils.getFunctionParametersTypes(A);

        expect(params).toEqual([ClassA, ClassB]);
    });

    it('should get param type', () => {
        @Foo
        class Test {
            @Autowire
            public param!: ClassA;

            @Bind
            public method(): ClassB {
                return new ClassB();
            }
        }

        expect(MetadataUtils.getClassPropertyType(Test.prototype, 'param')).toEqual(ClassA);
        expect(MetadataUtils.getClassMethodReturnType(Test.prototype, 'method')).toEqual(ClassB);
    });
});
