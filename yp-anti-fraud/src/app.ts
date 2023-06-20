import "reflect-metadata"
import initialize from './infrastructure/presentation';

const start = async () => {
    await initialize();
};

start();