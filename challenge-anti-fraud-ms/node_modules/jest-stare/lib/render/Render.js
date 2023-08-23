"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const $ = require("jquery");
const Switch_1 = require("./navigation/Switch");
const Constants_1 = require("./Constants");
const Status_1 = require("./charts/Status");
const Doughnut_1 = require("./charts/Doughnut");
const TestSuite_1 = require("./suites/TestSuite");
const TestSummary_1 = require("./summary/TestSummary");
const util_1 = require("util");
class Render {
    static init() {
        document.addEventListener("DOMContentLoaded", () => {
            const config = JSON.parse($("#test-config").text());
            const results = JSON.parse($("#test-results").text());
            try {
                const globalConfig = JSON.parse($("#test-global-config").text());
                const regex = new RegExp(Render.escapeRegExp(globalConfig.rootDir), "g");
                results.testResults.forEach((testResult) => {
                    testResult.testFilePath = testResult.testFilePath.replace(regex, "");
                });
            }
            catch (e) {
            }
            Render.show(results, config);
        });
    }
    static escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    static show(results, config) {
        const labels = [Constants_1.Constants.PASSED_LABEL, Constants_1.Constants.FAILED_LABEL];
        const backgroundColor = [Constants_1.Constants.PASS, Constants_1.Constants.FAIL];
        Render.setReportTitle(config);
        Render.setReportHeadline(config);
        Render.setCoverageLink(config);
        if (!config.disableCharts) {
            const suitesData = Render.buildChartsData(results.numPassedTestSuites, results.numFailedTestSuites, results.numPendingTestSuites);
            Doughnut_1.Doughnut.createChart($("#test-suites-canvas"), suitesData);
            const testsChart = Render.buildChartsData(results.numPassedTests, results.numFailedTests, results.numPendingTests, results.numTodoTests);
            Doughnut_1.Doughnut.createChart($("#tests-canvas"), testsChart);
            let snapshotChart = Render.buildChartsData(results.snapshot.matched, results.snapshot.unmatched);
            snapshotChart = Render.addSnapshotChartData(results, snapshotChart);
            Doughnut_1.Doughnut.createChart($("#snapshots-canvas"), snapshotChart);
        }
        this.updateStatusArea(results);
        const tableHtml = TestSuite_1.TestSuite.create(results);
        $("#loading-info").hide();
        $("#test-results").replaceWith($(tableHtml));
        if (config.reportSummary) {
            const testSummary = TestSummary_1.TestSummary.create(results);
            $("#test-summary").replaceWith($(testSummary));
        }
        if (config.hidePassing) {
            $("#lab-passoff-switch").prop("checked", false);
            $(`.${Constants_1.Constants.PASSED_TEST}`).hide();
        }
        if (config.hideFailing) {
            $("#lab-failoff-switch").prop("checked", false);
            $(`.${Constants_1.Constants.FAILED_TEST}`).hide();
        }
        if (config.hidePending) {
            $("#lab-pendingoff-switch").prop("checked", false);
            $(`.${Constants_1.Constants.PENDING_TEST}`).hide();
        }
        if (config.hideTodo) {
            $("#lab-todooff-switch").prop("checked", false);
            $(`.${Constants_1.Constants.TODO_TEST}`).hide();
        }
        if (config.hideFailing && config.hidePassing) {
            $(`.${Constants_1.Constants.FAILED_TEST}\\.${Constants_1.Constants.PASSED_TEST}`).hide();
        }
        if (config.hidePending && config.hidePassing) {
            $(`.${Constants_1.Constants.PASSED_TEST}\\.${Constants_1.Constants.PENDING_TEST}`).hide();
        }
        if (config.hideFailing && config.hidePending) {
            $(`.${Constants_1.Constants.FAILED_TEST}\\.${Constants_1.Constants.PENDING_TEST}`).hide();
        }
        if (config.hideFailing && config.hidePassing && config.hidePending) {
            $(`.${Constants_1.Constants.FAILED_TEST}\\.${Constants_1.Constants.PASSED_TEST}\\.${Constants_1.Constants.PENDING_TEST}`).hide();
        }
        const allCheckArray = new Array();
        allCheckArray.push($("#lab-passoff-switch"));
        allCheckArray.push($("#lab-failoff-switch"));
        allCheckArray.push($("#lab-pendingoff-switch"));
        allCheckArray.push($("#lab-todooff-switch"));
        const allStylesArray = [Constants_1.Constants.PASSED_TEST, Constants_1.Constants.FAILED_TEST, Constants_1.Constants.PENDING_TEST, Constants_1.Constants.TODO_TEST];
        const allSwitchArray = ["#lab-passoff-switch", "#lab-failoff-switch", "#lab-pendingoff-switch", "#lab-todooff-switch"];
        allStylesArray.forEach((style, index) => {
            const checksMinusCurrentOne = allCheckArray.slice();
            checksMinusCurrentOne.splice(index, 1);
            const stylesMinusCurrentOne = allStylesArray.slice();
            stylesMinusCurrentOne.splice(index, 1);
            const switchElement = new Switch_1.Switch($(allSwitchArray[index]), $("." + style), style, checksMinusCurrentOne, stylesMinusCurrentOne);
        });
    }
    static updateStatusArea(results) {
        Status_1.Status.setResultsClass($("#test-suites-results"), results.numPassedTestSuites, results.numTotalTestSuites - results.numPassedTestSuites - results.numPendingTestSuites);
        Status_1.Status.setResultsClass($("#tests-results"), results.numPassedTests, results.numTotalTests - results.numPassedTests - results.numPendingTests);
        Status_1.Status.setResultsClass($("#snapshots-results"), results.snapshot.matched, results.snapshot.unmatched);
        if (results.snapshot.added === 0 &&
            results.snapshot.matched === 0 &&
            results.snapshot.unchecked === 0 &&
            results.snapshot.unmatched === 0 &&
            results.snapshot.updated === 0) {
            $("#snapshots-group").hide();
        }
    }
    static setReportTitle(config) {
        const tabTitle = !(0, util_1.isNullOrUndefined)(config.reportTitle) ? config.reportTitle : "jest-stare!";
        document.title = tabTitle;
    }
    static setReportHeadline(config) {
        const brandTitle = !(0, util_1.isNullOrUndefined)(config.reportHeadline) ? config.reportHeadline : "jest-stare";
        const a = $("#navbar-title");
        a.text(brandTitle);
    }
    static setCoverageLink(config) {
        if (!(0, util_1.isNullOrUndefined)(config.coverageLink)) {
            const a = $("#coverage-link");
            a.addClass("active");
            a.removeClass("disabled");
            a.attr("href", config.coverageLink);
        }
    }
    static buildChartsData(passedTests, failedTests, pendingTests, todoTests) {
        const chartData = {
            labels: [],
            backgroundColor: [],
            data: [],
        };
        if (passedTests > 0) {
            chartData.labels.push(Constants_1.Constants.PASSED_LABEL);
            chartData.backgroundColor.push(Constants_1.Constants.PASS);
            chartData.data.push(passedTests);
        }
        if (failedTests > 0) {
            chartData.labels.push(Constants_1.Constants.FAILED_LABEL);
            chartData.backgroundColor.push(Constants_1.Constants.FAIL);
            chartData.data.push(failedTests);
        }
        if (pendingTests > 0) {
            chartData.labels.push(Constants_1.Constants.PENDING_LABEL);
            chartData.backgroundColor.push(Constants_1.Constants.PENDING);
            chartData.data.push(pendingTests);
        }
        if (todoTests > 0) {
            chartData.labels.push(Constants_1.Constants.TODO_LABEL);
            chartData.backgroundColor.push(Constants_1.Constants.TODO);
            chartData.data.push(todoTests);
        }
        return chartData;
    }
    static addSnapshotChartData(results, snapshotChart) {
        if (results.snapshot.filesAdded > 0) {
            snapshotChart.labels.push(Constants_1.Constants.ADDED_LABEL);
            snapshotChart.backgroundColor.push(Constants_1.Constants.ADDED);
            snapshotChart.data.push(results.snapshot.filesAdded);
        }
        if (results.snapshot.unchecked > 0) {
            if (results.snapshot.didUpdate) {
                snapshotChart.labels.push(Constants_1.Constants.UPDATED_SNAPSHOT_TEST_LABEL);
                snapshotChart.backgroundColor.push(Constants_1.Constants.UPDATED_SNAPSHOT_TEST);
                snapshotChart.data.push(results.snapshot.unchecked);
            }
            else {
                snapshotChart.labels.push(Constants_1.Constants.OBSOLETE_SNAPSHOT_TEST_LABEL);
                snapshotChart.backgroundColor.push(Constants_1.Constants.OBSOLETE_SNAPSHOT_TEST);
                snapshotChart.data.push(results.snapshot.unchecked);
            }
        }
        if (results.snapshot.updated > 0) {
            snapshotChart.labels.push(Constants_1.Constants.CHANGED_LABEL);
            snapshotChart.backgroundColor.push(Constants_1.Constants.CHANGED);
            snapshotChart.data.push(results.snapshot.updated);
        }
        if (results.snapshot.filesRemoved > 0) {
            if (results.snapshot.didUpdate) {
                snapshotChart.labels.push(Constants_1.Constants.REMOVED_OBSOLETE_SNAPSHOT_FILE_LABEL);
                snapshotChart.backgroundColor.push(Constants_1.Constants.REMOVED_OBSOLETE_SNAPSHOT_FILE);
                snapshotChart.data.push(results.snapshot.filesRemoved);
            }
            else {
                snapshotChart.labels.push(Constants_1.Constants.OBSOLETE_SNAPSHOT_FILE_LABEL);
                snapshotChart.backgroundColor.push(Constants_1.Constants.OBSOLETE_SNAPSHOT_FILE);
                snapshotChart.data.push(results.snapshot.filesRemoved);
            }
        }
        return snapshotChart;
    }
}
exports.Render = Render;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVuZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlbmRlci9SZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNEJBQTRCO0FBQzVCLGdEQUE2QztBQUM3QywyQ0FBd0M7QUFDeEMsNENBQXlDO0FBQ3pDLGdEQUE2QztBQUM3QyxrREFBK0M7QUFDL0MsdURBQW9EO0FBR3BELCtCQUF5QztBQVN6QyxNQUFhLE1BQU07SUFRUixNQUFNLENBQUMsSUFBSTtRQUNkLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDL0MsTUFBTSxNQUFNLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdEUsTUFBTSxPQUFPLEdBQXFCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFeEUsSUFBSTtnQkFDQSxNQUFNLFlBQVksR0FBMEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN4RixNQUFNLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDekUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtvQkFDdkMsVUFBVSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3pFLENBQUMsQ0FBQyxDQUFDO2FBQ047WUFBQyxPQUFPLENBQUMsRUFBRTthQUVYO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUs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