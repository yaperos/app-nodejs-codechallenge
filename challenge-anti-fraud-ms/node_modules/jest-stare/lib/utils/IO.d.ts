/// <reference types="node" />
import * as fs from "fs";
export declare class IO {
    static unlinkSync(file: string): void;
    static writeFile(wpath: string, data: any): Promise<void>;
    static writeFileSync(wpath: string, data: any): void;
    static mkDirSync(dir: string): void;
    static mkdirsSync(dir: string): void;
    static readFileSync(wpath: string): string;
    static existsSync(wpath: string): boolean;
    static readPackageJson(): object;
    static copyFileSync(src: fs.PathLike, dest: fs.PathLike): void;
}
