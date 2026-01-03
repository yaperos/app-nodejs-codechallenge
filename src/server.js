const app = require('./app');
const { startConsumer } = require('./kafka/consumer');

const PORT = 3000;

async function start() {
    await startConsumer();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
}

start();
