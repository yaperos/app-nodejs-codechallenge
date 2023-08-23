'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');
var fs = require('fs');
var os = require('os');
var path = require('path');

class InvalidPathError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPathError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidPathError.prototype);
    }
}

class NoMatchError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoMatchError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, NoMatchError.prototype);
    }
}

/**
 * Get the first existing parent path
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
function getFirstExistingParentPath(directoryPath, dependencies) {
    let parentDirectoryPath = directoryPath;
    let parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath);
    while (!parentDirectoryFound) {
        parentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + '/..');
        parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath);
    }
    return parentDirectoryPath;
}

/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 * @param release - OS Release number
 */
function hasPowerShell3(dependencies) {
    const major = parseInt(dependencies.release.split('.')[0], 10);
    if (major > 6) {
        try {
            dependencies.cpExecFileSync('powershell');
            return true;
        }
        catch (err) {
            return false;
        }
    }
    else {
        return false;
    }
}

/**
 * Check disk space
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
function checkDiskSpace(directoryPath, dependencies = {
    platform: process.platform,
    release: os.release(),
    fsExistsSync: fs.existsSync,
    pathNormalize: path.normalize,
    pathSep: path.sep,
    cpExecFile: child_process.execFile,
    cpExecFileSync: child_process.execFileSync,
}) {
    // Note: This function contains other functions in order
    //       to wrap them in a common context and make unit tests easier
    /**
     * Maps command output to a normalized object {diskPath, free, size}
     *
     * @param stdout - The command output
     * @param filter - To filter drives (only used for win32)
     * @param mapping - Map between column index and normalized column name
     * @param coefficient - The size coefficient to get bytes instead of kB
     */
    function mapOutput(stdout, filter, mapping, coefficient) {
        const parsed = stdout.trim().split('\n').slice(1).map(line => {
            return line.trim().split(/\s+(?=[\d/])/);
        });
        const filtered = parsed.filter(filter);
        if (filtered.length === 0) {
            throw new NoMatchError();
        }
        const diskData = filtered[0];
        return {
            diskPath: diskData[mapping.diskPath],
            free: parseInt(diskData[mapping.free], 10) * coefficient,
            size: parseInt(diskData[mapping.size], 10) * coefficient,
        };
    }
    /**
     * Run the command and do common things between win32 and unix
     *
     * @param cmd - The command to execute
     * @param filter - To filter drives (only used for win32)
     * @param mapping - Map between column index and normalized column name
     * @param coefficient - The size coefficient to get bytes instead of kB
     */
    function check(cmd, filter, mapping, coefficient = 1) {
        return new Promise((resolve, reject) => {
            const [file, ...args] = cmd;
            /* istanbul ignore if */
            if (file === undefined) {
                return Promise.reject(new Error('cmd must contain at least one item'));
            }
            dependencies.cpExecFile(file, args, (error, stdout) => {
                if (error) {
                    reject(error);
                }
                try {
                    resolve(mapOutput(stdout, filter, mapping, coefficient));
                }
                catch (error2) {
                    reject(error2);
                }
            });
        });
    }
    /**
     * Build the check call for win32
     *
     * @param directoryPath - The file/folder path from where we want to know disk space
     */
    function checkWin32(directoryPath) {
        if (directoryPath.charAt(1) !== ':') {
            return new Promise((resolve, reject) => {
                reject(new InvalidPathError(`The following path is invalid (should be X:\\...): ${directoryPath}`));
            });
        }
        const powershellCmd = [
            'powershell',
            'Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object Caption, FreeSpace, Size',
        ];
        const wmicCmd = [
            'wmic',
            'logicaldisk',
            'get',
            'size,freespace,caption',
        ];
        const cmd = hasPowerShell3(dependencies) ? powershellCmd : wmicCmd;
        return check(cmd, driveData => {
            // Only get the drive which match the path
            const driveLetter = driveData[0];
            return directoryPath.toUpperCase().startsWith(driveLetter.toUpperCase());
        }, {
            diskPath: 0,
            free: 1,
            size: 2,
        });
    }
    /**
     * Build the check call for unix
     *
     * @param directoryPath - The file/folder path from where we want to know disk space
     */
    function checkUnix(directoryPath) {
        if (!dependencies.pathNormalize(directoryPath).startsWith(dependencies.pathSep)) {
            return new Promise((resolve, reject) => {
                reject(new InvalidPathError(`The following path is invalid (should start by ${dependencies.pathSep}): ${directoryPath}`));
            });
        }
        const pathToCheck = getFirstExistingParentPath(directoryPath, dependencies);
        return check([
            'df',
            '-Pk',
            '--',
            pathToCheck,
        ], () => true, // We should only get one line, so we did not need to filter
        {
            diskPath: 5,
            free: 3,
            size: 1,
        }, 1024);
    }
    // Call the right check depending on the OS
    if (dependencies.platform === 'win32') {
        return checkWin32(directoryPath);
    }
    return checkUnix(directoryPath);
}

exports.InvalidPathError = InvalidPathError;
exports.NoMatchError = NoMatchError;
exports["default"] = checkDiskSpace;
exports.getFirstExistingParentPath = getFirstExistingParentPath;
