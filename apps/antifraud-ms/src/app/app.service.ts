import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { RootRules } from '../interfaces/rules.interface';
export const ROUTES_CONFIG = 'ROUTES_CONFIG';
import {
  AntifraudRequest,
  AntifraudResponse,
} from '@app-nodejs-codechallenge/core-lib';
import { Injectable, Logger } from '@nestjs/common';

const YAML_CONFIG_FILENAME = 'assets/fraud-rules.config.yaml';

@Injectable()
export class AppService {
  logger = new Logger(AppService.name);

  validateTransaction(tx: AntifraudRequest): AntifraudResponse {
    this.logger.log(`Verifying transfer ${JSON.stringify(tx)}`);

    const { amount } = tx;

    const rules = this.loadYaml()['fraud-rules'].filter((rule) => rule.enabled);
    for (const rule of rules) {
      const { condition, value, enabled, description } = rule;
      if (enabled) {
        const result = this.evaluateRule(condition, amount, value);
        if (result.isFraud) {
          return { isFraud: true, amount, message: description };
        }
      }
    }
    return { isFraud: false, amount, message: 'No fraud detected' };
  }

  evaluateRule(condition: string, amount: number, value: number) {
    return { isFraud: eval(`${amount} ${condition} ${value}`) };
  }

  loadYaml = () => {
    try {
      const yamlPath = join(__dirname, YAML_CONFIG_FILENAME);
      const json = yaml.load(readFileSync(yamlPath, 'utf8')) as RootRules;
      return json;
    } catch (error) {
      console.error(`Error loading the YAML config file: ${error}`);
    }
  };
}
