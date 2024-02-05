const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectKey': 'antifraud',
      'sonar.projectName': 'antifraud',
      'sonar.sources': 'src',
      'sonar.tests': 'src',
      'sonar.token': 'sqp_cee6cdd0518779efddfea1a1685299acb405b082',
      'sonar.inclusions': 'src/**/*.ts',
      'sonar.test.inclusions':
        'src/**/*.spec.ts,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    },
  },
  () => {
    console.log('Error Occurred while scanning');
  },
);
