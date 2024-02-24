import 'reflect-metadata';

export class MetadataUtils {
    public static getFunctionParametersTypes(fn: Function) {
        const props = Reflect.getMetadata('design:paramtypes', fn);
        if (props && props instanceof Array) return props;
        return [];
    }

    public static getClassPropertyType(target: any, propertyName: string | symbol) {
        return Reflect.getMetadata('design:type', target, propertyName);
    }

    public static getClassMethodReturnType(target: any, propertyName: string | symbol) {
        return Reflect.getMetadata('design:returntype', target, propertyName);
    }
}
