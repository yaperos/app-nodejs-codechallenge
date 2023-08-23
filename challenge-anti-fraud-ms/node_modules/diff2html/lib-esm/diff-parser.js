import { LineType } from './types';
import { escapeForRegExp } from './utils';
function getExtension(filename, language) {
    const filenameParts = filename.split('.');
    return filenameParts.length > 1 ? filenameParts[filenameParts.length - 1] : language;
}
function startsWithAny(str, prefixes) {
    return prefixes.reduce((startsWith, prefix) => startsWith || str.startsWith(prefix), false);
}
const baseDiffFilenamePrefixes = ['a/', 'b/', 'i/', 'w/', 'c/', 'o/'];
function getFilename(line, linePrefix, extraPrefix) {
    const prefixes = extraPrefix !== undefined ? [...baseDiffFilenamePrefixes, extraPrefix] : baseDiffFilenamePrefixes;
    const FilenameRegExp = linePrefix
        ? new RegExp(`^${escapeForRegExp(linePrefix)} "?(.+?)"?$`)
        : new RegExp('^"?(.+?)"?$');
    const [, filename = ''] = FilenameRegExp.exec(line) || [];
    const matchingPrefix = prefixes.find(p => filename.indexOf(p) === 0);
    const fnameWithoutPrefix = matchingPrefix ? filename.slice(matchingPrefix.length) : filename;
    return fnameWithoutPrefix.replace(/\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/, '');
}
function getSrcFilename(line, srcPrefix) {
    return getFilename(line, '---', srcPrefix);
}
function getDstFilename(line, dstPrefix) {
    return getFilename(line, '+++', dstPrefix);
}
export function parse(diffInput, config = {}) {
    const files = [];
    let currentFile = null;
    let currentBlock = null;
    let oldLine = null;
    let oldLine2 = null;
    let newLine = null;
    let possibleOldName = null;
    let possibleNewName = null;
    const oldFileNameHeader = '--- ';
    const newFileNameHeader = '+++ ';
    const hunkHeaderPrefix = '@@';
    const oldMode = /^old mode (\d{6})/;
    const newMode = /^new mode (\d{6})/;
    const deletedFileMode = /^deleted file mode (\d{6})/;
    const newFileMode = /^new file mode (\d{6})/;
    const copyFrom = /^copy from "?(.+)"?/;
    const copyTo = /^copy to "?(.+)"?/;
    const renameFrom = /^rename from "?(.+)"?/;
    const renameTo = /^rename to "?(.+)"?/;
    const similarityIndex = /^similarity index (\d+)%/;
    const dissimilarityIndex = /^dissimilarity index (\d+)%/;
    const index = /^index ([\da-z]+)\.\.([\da-z]+)\s*(\d{6})?/;
    const binaryFiles = /^Binary files (.*) and (.*) differ/;
    const binaryDiff = /^GIT binary patch/;
    const combinedIndex = /^index ([\da-z]+),([\da-z]+)\.\.([\da-z]+)/;
    const combinedMode = /^mode (\d{6}),(\d{6})\.\.(\d{6})/;
    const combinedNewFile = /^new file mode (\d{6})/;
    const combinedDeletedFile = /^deleted file mode (\d{6}),(\d{6})/;
    const diffLines = diffInput
        .replace(/\\ No newline at end of file/g, '')
        .replace(/\r\n?/g, '\n')
        .split('\n');
    function saveBlock() {
        if (currentBlock !== null && currentFile !== null) {
            currentFile.blocks.push(currentBlock);
            currentBlock = null;
        }
    }
    function saveFile() {
        if (currentFile !== null) {
            if (!currentFile.oldName && possibleOldName !== null) {
                currentFile.oldName = possibleOldName;
            }
            if (!currentFile.newName && possibleNewName !== null) {
                currentFile.newName = possibleNewName;
            }
            if (currentFile.newName) {
                files.push(currentFile);
                currentFile = null;
            }
        }
        possibleOldName = null;
        possibleNewName = null;
    }
    function startFile() {
        saveBlock();
        saveFile();
        currentFile = {
            blocks: [],
            deletedLines: 0,
            addedLines: 0,
        };
    }
    function startBlock(line) {
        saveBlock();
        let values;
        if (currentFile !== null) {
            if ((values = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@.*/.exec(line))) {
                currentFile.isCombined = false;
                oldLine = parseInt(values[1], 10);
                newLine = parseInt(values[2], 10);
            }
            else if ((values = /^@@@ -(\d+)(?:,\d+)? -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@@.*/.exec(line))) {
                currentFile.isCombined = true;
                oldLine = parseInt(values[1], 10);
                oldLine2 = parseInt(values[2], 10);
                newLine = parseInt(values[3], 10);
            }
            else {
                if (line.startsWith(hunkHeaderPrefix)) {
                    console.error('Failed to parse lines, starting in 0!');
                }
                oldLine = 0;
                newLine = 0;
                currentFile.isCombined = false;
            }
        }
        currentBlock = {
            lines: [],
            oldStartLine: oldLine,
            oldStartLine2: oldLine2,
            newStartLine: newLine,
            header: line,
        };
    }
    function createLine(line) {
        if (currentFile === null || currentBlock === null || oldLine === null || newLine === null)
            return;
        const currentLine = {
            content: line,
        };
        const addedPrefixes = currentFile.isCombined ? ['+ ', ' +', '++'] : ['+'];
        const deletedPrefixes = currentFile.isCombined ? ['- ', ' -', '--'] : ['-'];
        if (startsWithAny(line, addedPrefixes)) {
            currentFile.addedLines++;
            currentLine.type = LineType.INSERT;
            currentLine.oldNumber = undefined;
            currentLine.newNumber = newLine++;
        }
        else if (startsWithAny(line, deletedPrefixes)) {
            currentFile.deletedLines++;
            currentLine.type = LineType.DELETE;
            currentLine.oldNumber = oldLine++;
            currentLine.newNumber = undefined;
        }
        else {
            currentLine.type = LineType.CONTEXT;
            currentLine.oldNumber = oldLine++;
            currentLine.newNumber = newLine++;
        }
        currentBlock.lines.push(currentLine);
    }
    function existHunkHeader(line, lineIdx) {
        let idx = lineIdx;
        while (idx < diffLines.length - 3) {
            if (line.startsWith('diff')) {
                return false;
            }
            if (diffLines[idx].startsWith(oldFileNameHeader) &&
                diffLines[idx + 1].startsWith(newFileNameHeader) &&
                diffLines[idx + 2].startsWith(hunkHeaderPrefix)) {
                return true;
            }
            idx++;
        }
        return false;
    }
    diffLines.forEach((line, lineIndex) => {
        if (!line || line.startsWith('*')) {
            return;
        }
        let values;
        const prevLine = diffLines[lineIndex - 1];
        const nxtLine = diffLines[lineIndex + 1];
        const afterNxtLine = diffLines[lineIndex + 2];
        if (line.startsWith('diff --git') || line.startsWith('diff --combined')) {
            startFile();
            const gitDiffStart = /^diff --git "?([a-ciow]\/.+)"? "?([a-ciow]\/.+)"?/;
            if ((values = gitDiffStart.exec(line))) {
                possibleOldName = getFilename(values[1], undefined, config.dstPrefix);
                possibleNewName = getFilename(values[2], undefined, config.srcPrefix);
            }
            if (currentFile === null) {
                throw new Error('Where is my file !!!');
            }
            currentFile.isGitDiff = true;
            return;
        }
        if (line.startsWith('Binary files') && !(currentFile === null || currentFile === void 0 ? void 0 : currentFile.isGitDiff)) {
            startFile();
            const unixDiffBinaryStart = /^Binary files "?([a-ciow]\/.+)"? and "?([a-ciow]\/.+)"? differ/;
            if ((values = unixDiffBinaryStart.exec(line))) {
                possibleOldName = getFilename(values[1], undefined, config.dstPrefix);
                possibleNewName = getFilename(values[2], undefined, config.srcPrefix);
            }
            if (currentFile === null) {
                throw new Error('Where is my file !!!');
            }
            currentFile.isBinary = true;
            return;
        }
        if (!currentFile ||
            (!currentFile.isGitDiff &&
                currentFile &&
                line.startsWith(oldFileNameHeader) &&
                nxtLine.startsWith(newFileNameHeader) &&
                afterNxtLine.startsWith(hunkHeaderPrefix))) {
            startFile();
        }
        if (currentFile === null || currentFile === void 0 ? void 0 : currentFile.isTooBig) {
            return;
        }
        if (currentFile &&
            ((typeof config.diffMaxChanges === 'number' &&
                currentFile.addedLines + currentFile.deletedLines > config.diffMaxChanges) ||
                (typeof config.diffMaxLineLength === 'number' && line.length > config.diffMaxLineLength))) {
            currentFile.isTooBig = true;
            currentFile.addedLines = 0;
            currentFile.deletedLines = 0;
            currentFile.blocks = [];
            currentBlock = null;
            const message = typeof config.diffTooBigMessage === 'function'
                ? config.diffTooBigMessage(files.length)
                : 'Diff too big to be displayed';
            startBlock(message);
            return;
        }
        if ((line.startsWith(oldFileNameHeader) && nxtLine.startsWith(newFileNameHeader)) ||
            (line.startsWith(newFileNameHeader) && prevLine.startsWith(oldFileNameHeader))) {
            if (currentFile &&
                !currentFile.oldName &&
                line.startsWith('--- ') &&
                (values = getSrcFilename(line, config.srcPrefix))) {
                currentFile.oldName = values;
                currentFile.language = getExtension(currentFile.oldName, currentFile.language);
                return;
            }
            if (currentFile &&
                !currentFile.newName &&
                line.startsWith('+++ ') &&
                (values = getDstFilename(line, config.dstPrefix))) {
                currentFile.newName = values;
                currentFile.language = getExtension(currentFile.newName, currentFile.language);
                return;
            }
        }
        if (currentFile &&
            (line.startsWith(hunkHeaderPrefix) ||
                (currentFile.isGitDiff && currentFile.oldName && currentFile.newName && !currentBlock))) {
            startBlock(line);
            return;
        }
        if (currentBlock && (line.startsWith('+') || line.startsWith('-') || line.startsWith(' '))) {
            createLine(line);
            return;
        }
        const doesNotExistHunkHeader = !existHunkHeader(line, lineIndex);
        if (currentFile === null) {
            throw new Error('Where is my file !!!');
        }
        if ((values = oldMode.exec(line))) {
            currentFile.oldMode = values[1];
        }
        else if ((values = newMode.exec(line))) {
            currentFile.newMode = values[1];
        }
        else if ((values = deletedFileMode.exec(line))) {
            currentFile.deletedFileMode = values[1];
            currentFile.isDeleted = true;
        }
        else if ((values = newFileMode.exec(line))) {
            currentFile.newFileMode = values[1];
            currentFile.isNew = true;
        }
        else if ((values = copyFrom.exec(line))) {
            if (doesNotExistHunkHeader) {
                currentFile.oldName = values[1];
            }
            currentFile.isCopy = true;
        }
        else if ((values = copyTo.exec(line))) {
            if (doesNotExistHunkHeader) {
                currentFile.newName = values[1];
            }
            currentFile.isCopy = true;
        }
        else if ((values = renameFrom.exec(line))) {
            if (doesNotExistHunkHeader) {
                currentFile.oldName = values[1];
            }
            currentFile.isRename = true;
        }
        else if ((values = renameTo.exec(line))) {
            if (doesNotExistHunkHeader) {
                currentFile.newName = values[1];
            }
            currentFile.isRename = true;
        }
        else if ((values = binaryFiles.exec(line))) {
            currentFile.isBinary = true;
            currentFile.oldName = getFilename(values[1], undefined, config.srcPrefix);
            currentFile.newName = getFilename(values[2], undefined, config.dstPrefix);
            startBlock('Binary file');
        }
        else if (binaryDiff.test(line)) {
            currentFile.isBinary = true;
            startBlock(line);
        }
        else if ((values = similarityIndex.exec(line))) {
            currentFile.unchangedPercentage = parseInt(values[1], 10);
        }
        else if ((values = dissimilarityIndex.exec(line))) {
            currentFile.changedPercentage = parseInt(values[1], 10);
        }
        else if ((values = index.exec(line))) {
            currentFile.checksumBefore = values[1];
            currentFile.checksumAfter = values[2];
            values[3] && (currentFile.mode = values[3]);
        }
        else if ((values = combinedIndex.exec(line))) {
            currentFile.checksumBefore = [values[2], values[3]];
            currentFile.checksumAfter = values[1];
        }
        else if ((values = combinedMode.exec(line))) {
            currentFile.oldMode = [values[2], values[3]];
            currentFile.newMode = values[1];
        }
        else if ((values = combinedNewFile.exec(line))) {
            currentFile.newFileMode = values[1];
            currentFile.isNew = true;
        }
        else if ((values = combinedDeletedFile.exec(line))) {
            currentFile.deletedFileMode = values[1];
            currentFile.isDeleted = true;
        }
    });
    saveBlock();
    saveFile();
    return files;
}
//# sourceMappingURL=diff-parser.js.map