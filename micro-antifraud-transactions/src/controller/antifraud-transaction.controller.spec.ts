import * as sinon from "sinon";
import { Batch, EachBatchPayload, KafkaMessage } from "kafkajs";
import { consumer } from "@micro/kafka";

describe("Antifraud Unit Testing", async () => {
  const sandbox = sinon.createSandbox();

  function mockBatch(messages: KafkaMessage[]): EachBatchPayload {
    const batch: Batch = {
      highWatermark: "undefined",
      partition: 0,
      topic: "undefined",
      firstOffset: sinon.stub(),
      isEmpty: sinon.stub(),
      lastOffset: sinon.stub(),
      offsetLag: sinon.stub(),
      offsetLagLow: sinon.stub(),
      messages,
    };

    return {
      commitOffsetsIfNecessary: sinon.stub(),
      heartbeat: sinon.stub(),
      isRunning: sinon.stub(),
      isStale: sinon.stub(),
      pause: sinon.stub(),
      resolveOffset: sinon.stub(),
      uncommittedOffsets: sinon.stub(),
      batch,
    };
  }

  beforeEach(() => {
    process.env.PORT = undefined;
  });

  afterEach(() => {
    sandbox.restore();
  });

  async function getMessages(message: KafkaMessage) {
    return message;
  }

  it("Mock eachBatch messages when a consumer is running", async () => {
    const eachBatchStub = sinon.stub();
    const eachBatch = async ({ batch }: EachBatchPayload) => {
      eachBatchStub();
      await Promise.all(
        batch.messages.map(async (message: KafkaMessage) => {
          await getMessages(message);
        }),
      );
    };
    await consumer.connect();
    await consumer.subscribe({
      topic: `test-2`,
      fromBeginning: false,
    });
    await consumer.run({
      eachBatch: eachBatch,
      autoCommit: true,
    });

    const messages: KafkaMessage[] = [
      {
        key: null,
        value: Buffer.allocUnsafe(0),
        timestamp: "",
        attributes: 0,
        offset: "",
        size: 0,
      },
    ];

    await eachBatch({
      ...mockBatch(messages),
    });

    sinon.assert.calledOnce(eachBatchStub);
  });
});
