import {
    changeTSToJSPath,
    modifyDataSourceOptionsForRuntimeEnvironment
} from "../../../src";

describe('src/connection/utils.ts', () => {
    it('should change ts to js path', () => {
        let srcPath = 'src/packages/backend/src/data-source.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('src/packages/backend/dist/data-source.js');

        srcPath = 'src/packages/backend/my-src/data-source.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('src/packages/backend/my-src/data-source.js');

        srcPath = 'src/entities.cts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/entities.cjs');

        srcPath = 'src/entities.mts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/entities.mjs');

        srcPath = 'src/ts/entities.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/ts/entities.js');

        srcPath = 'my-src/entities.js';
        expect(changeTSToJSPath(srcPath)).toEqual('my-src/entities.js');

        srcPath = 'my-src/entities.ts'
        expect(changeTSToJSPath(srcPath)).toEqual('my-src/entities.js');

        srcPath = './src/entities.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/entities.js');

        srcPath = 'src/entities.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/entities.js');

        srcPath = '/src/entities.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('/dist/entities.js');

        srcPath = 'src/ts.{ts}';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/ts.{js}');

        srcPath = 'src/ts.ts.{ts,cts}';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/ts.ts.{js,cjs}');

        srcPath = 'src/*.{ts,cts}';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/*.{js,cjs}');

        srcPath = 'src/ts.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/ts.js');

        const srcPaths = ['src/entities.ts', './src/entities.ts'];
        for(let i=0; i<srcPaths.length; i++) {
            srcPath = srcPaths[i];

            expect(changeTSToJSPath(srcPath, 'dist')).toEqual('dist/entities.js');
            expect(changeTSToJSPath(srcPath, './dist')).toEqual('dist/entities.js');
            expect(changeTSToJSPath(srcPath, 'dist/')).toEqual('dist/entities.js');
            expect(changeTSToJSPath(srcPath, '/dist/')).toEqual('/dist/entities.js');

            expect(changeTSToJSPath(srcPath, undefined, 'src')).toEqual('dist/entities.js');
            expect(changeTSToJSPath(srcPath, undefined, './src')).toEqual('dist/entities.js');
            expect(changeTSToJSPath(srcPath, undefined, 'src/')).toEqual('dist/entities.js');

            expect(changeTSToJSPath(srcPath, './dist', './src')).toEqual('dist/entities.js');
        }

        srcPath = 'src/entities.ts';
        expect(changeTSToJSPath(srcPath, 'output')).toEqual('output/entities.js');
    });

    it('should change ts to js path with pattern', () => {
        let srcPath = 'src/entities.{ts,cts,mts}';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/entities.{js,cjs,mjs}');

        srcPath = 'src/**/entities.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/**/entities.js');

        srcPath = 'src/*.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/*.js');

        srcPath = 'src/ts/*.ts';
        expect(changeTSToJSPath(srcPath)).toEqual('dist/ts/*.js');
    })

    it('should not change ts to js path', () => {
        let srcPath = 'src/entities.ts';
        expect(changeTSToJSPath(srcPath, undefined, 'dummySrc')).toEqual('src/entities.js');

        expect(changeTSToJSPath(srcPath, undefined, '../src')).toEqual('src/entities.js');
    })

    it('should modify connection option(s) for runtime environment', async () => {
        const modifiedConnectionOptions = await modifyDataSourceOptionsForRuntimeEnvironment({
            factories: ['src/factories.ts'],
            seeds: ['src/seeds.ts'],
            entities: ['src/entities.ts'],
            subscribers: ['src/subscribers.ts']
        });

        expect(modifiedConnectionOptions).toEqual({
            factories: ['dist/factories.js'],
            seeds: ['dist/seeds.js'],
            entities: ['dist/entities.js'],
            subscribers: ['dist/subscribers.js']
        });

        let modifiedConnectionOption = await modifyDataSourceOptionsForRuntimeEnvironment({
            entities: ['./src/entities.ts']
        });
        expect(modifiedConnectionOption).toEqual({entities: ['dist/entities.js']});

        const modifiedConnectionOptionAlt = await modifyDataSourceOptionsForRuntimeEnvironment({
            entities: ['src/entities.ts']
        });
        expect(modifiedConnectionOptionAlt).toEqual({entities: ['dist/entities.js']});
    })
});
