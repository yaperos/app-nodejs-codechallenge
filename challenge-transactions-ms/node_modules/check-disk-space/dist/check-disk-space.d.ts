import { ChildProcess, ExecException } from 'child_process';
import { existsSync } from 'fs';
import { normalize, sep } from 'path';

declare class InvalidPathError extends Error {
    name: string;
    constructor(message?: string);
}

declare class NoMatchError extends Error {
    name: string;
    constructor(message?: string);
}

declare type ExecFileException = ExecException & NodeJS.ErrnoException;
declare type Dependencies = {
    platform: NodeJS.Platform;
    release: string;
    fsExistsSync: typeof existsSync;
    pathNormalize: typeof normalize;
    pathSep: typeof sep;
    cpExecFile: (file: string, args: ReadonlyArray<string> | undefined | null, callback: (error: ExecFileException | null, stdout: string, stderr: string) => void) => ChildProcess;
    cpExecFileSync: (command: string) => Buffer;
};

/**
 * Get the first existing parent path
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
declare function getFirstExistingParentPath(directoryPath: string, dependencies: Dependencies): string;

/**
 * `free` and `size` are in bytes
 */
declare type DiskSpace = {
    diskPath: string;
    free: number;
    size: number;
};

/**
 * Check disk space
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
declare function checkDiskSpace(directoryPath: string, dependencies?: Dependencies): Promise<DiskSpace>;

export { Dependencies, DiskSpace, InvalidPathError, NoMatchError, checkDiskSpace as default, getFirstExistingParentPath };
