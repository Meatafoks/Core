import { DEFAULT_CONTAINER_ID, MetafoksContainer, MetafoksRegistry } from '../../src';
import { MetafoksLogger } from '@metafoks/logger';

describe('basic registry tests', () => {
    MetafoksLogger.createGlobal({ enabledFileWriting: false });
    MetafoksLogger.global.overrideLevelProperties({ app: 'debug' });

    beforeEach(() => MetafoksRegistry.clear());

    it('should create container in registry', () => {
        const container = new MetafoksContainer('test');
        expect(MetafoksRegistry.get('test')).toEqual(container);
    });

    it('should throw not found', () => {
        expect(() => MetafoksRegistry.get('test')).toThrow();
    });

    it('should has default container', () => {
        const container = MetafoksContainer.default;
        expect(MetafoksRegistry.has(DEFAULT_CONTAINER_ID)).toBeTruthy();
        expect(MetafoksRegistry.getDefaultContainer()).toEqual(container);
    });
});
