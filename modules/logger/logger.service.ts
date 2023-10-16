import { Inject, LoggerService } from '@nestjs/common';
import { CONTEXT } from './constants';
import moment from 'moment';
import chalk from 'chalk';

export class Logger implements LoggerService {
  private readonly context: string;
  constructor(@Inject(CONTEXT) context: string) {
    this.context = context;
  }
  log(message: string) {
    const formattedDate = moment().format('MM/DD/YYYY, h:mm:ss A');
    console.log(
      chalk.cyan(`[${formattedDate}]`),
      chalk.green(`[${this.context}]\n`),
      chalk.green('=> LOG'),
      `${message}`,
    );
  }

  error(message: string, trace: string) {
    const formattedDate = moment().format('MM/DD/YYYY, h:mm:ss A');
    console.error(
      chalk.cyan(`[${formattedDate}]`),
      chalk.green(`[${this.context}]\n`),
      chalk.red('=> ERROR'),
      `${message}`,
      chalk.red(trace),
    );
  }

  warn(message: string) {
    const formattedDate = moment().format('MM/DD/YYYY, h:mm:ss A');
    console.warn(
      chalk.cyan(`[${formattedDate}]`),
      chalk.green(`[${this.context}]\n`),
      chalk.yellow('=> WARN'),
      `${message}`,
    );
  }

  debug(message: string) {
    const formattedDate = moment().format('MM/DD/YYYY, h:mm:ss A');
    console.warn(
      chalk.cyan(`[${formattedDate}]`),
      chalk.green(`[${this.context}]\n`),
      chalk.blue('=> DEBUG'),
      `${message}`,
    );
  }
}
