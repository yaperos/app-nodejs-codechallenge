"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageSnapshotDifference = void 0;
const $ = require("jquery");
const Constants_1 = require("../../processor/Constants");
const AnsiParser = require("ansi-parser");
class ImageSnapshotDifference {
    static containsDiff(jestFailureMessage) {
        let isFailure = false;
        for (const indicator of ImageSnapshotDifference.DIFF_INDICATOR) {
            if (jestFailureMessage.indexOf(indicator) >= 0) {
                isFailure = true;
                break;
            }
        }
        return isFailure;
    }
    static generate(jestFailureMessage) {
        const imageDiffFilename = ImageSnapshotDifference.parseDiffImageName(jestFailureMessage);
        const errorMessage = ImageSnapshotDifference.parseDiffError(jestFailureMessage);
        const diffDiv = document.createElement("div");
        diffDiv.className = "image-snapshot-diff";
        const diffMessage = document.createElement("span");
        diffMessage.textContent = errorMessage;
        diffMessage.className = "text-muted";
        diffDiv.appendChild(diffMessage);
        const diffImageLink = document.createElement("a");
        diffImageLink.href = Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR + imageDiffFilename;
        diffDiv.appendChild(diffImageLink);
        const diffImage = document.createElement("img");
        diffImage.src = Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR + imageDiffFilename;
        diffImageLink.appendChild(diffImage);
        return $(diffDiv).get(0);
    }
    static parseDiffImagePath(jestFailureMessage) {
        const match = ImageSnapshotDifference.DIFF_IMAGE.exec(jestFailureMessage);
        if (match) {
            return AnsiParser.removeAnsi(match[1]).trim();
        }
        return null;
    }
    static parseDiffImageName(jestFailureMessage) {
        const path = ImageSnapshotDifference.parseDiffImagePath(jestFailureMessage);
        if (path) {
            return path.replace(/^.*[\\\/]/, "");
        }
    }
    static parseDiffError(jestFailureMessage) {
        const match = ImageSnapshotDifference.DIFF_DETAILS.exec(jestFailureMessage);
        if (match) {
            return match[1];
        }
        return null;
    }
}
exports.ImageSnapshotDifference = ImageSnapshotDifference;
ImageSnapshotDifference.DIFF_INDICATOR = ["different from snapshot", "image to be the same size"];
ImageSnapshotDifference.DIFF_IMAGE = /See diff for details:\s*((.*?)\.png)/;
ImageSnapshotDifference.DIFF_DETAILS = /Error: (.*)/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZ2VTbmFwc2hvdERpZmZlcmVuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVuZGVyL2RpZmYvSW1hZ2VTbmFwc2hvdERpZmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLHlEQUFzRDtBQUN0RCwwQ0FBMEM7QUFPMUMsTUFBYSx1QkFBdUI7SUFZekIsTUFBTSxDQUFDLFlBQVksQ0FBQyxrQkFBMEI7UUFDakQsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLEtBQUssTUFBTSxTQUFTLElBQUksdUJBQXVCLENBQUMsY0FBYyxFQUFFO1lBQzlELElBQUksa0JBQWtCLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDOUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDakIsTUFBTTthQUNQO1NBQ0Y7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBU00sTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBMEI7UUFDN0MsTUFBTSxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sWUFBWSxHQUFHLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRWhGLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFtQixDQUFDO1FBQ2hFLE9BQU8sQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUM7UUFFMUMsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQW9CLENBQUM7UUFDdEUsV0FBVyxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUM7UUFDdkMsV0FBVyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDckMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVqQyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBc0IsQ0FBQztRQUN2RSxhQUFhLENBQUMsSUFBSSxHQUFHLHFCQUFTLENBQUMsdUJBQXVCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0UsT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVuQyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBcUIsQ0FBQztRQUNwRSxTQUFTLENBQUMsR0FBRyxHQUFHLHFCQUFTLENBQUMsdUJBQXVCLEdBQUcsaUJBQWlCLENBQUM7UUFDdEUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVyQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQVFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBMEI7UUFFdkQsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTFFLElBQUksS0FBSyxFQUFFO1lBQ1AsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQVFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxrQkFBMEI7UUFFdkQsTUFBTSxJQUFJLEdBQUcsdUJBQXVCLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUU1RSxJQUFJLElBQUksRUFBRTtZQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDeEM7SUFDTCxDQUFDO0lBT08sTUFBTSxDQUFDLGNBQWMsQ0FBQyxrQkFBMEI7UUFFcEQsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTVFLElBQUksS0FBSyxFQUFFO1lBQ1AsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOztBQXBHTCwwREFxR0M7QUFuR2lCLHNDQUFjLEdBQWEsQ0FBQyx5QkFBeUIsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBQ3BGLGtDQUFVLEdBQVcsc0NBQXNDLENBQUM7QUFDNUQsb0NBQVksR0FBVyxhQUFhLENBQUMifQ==