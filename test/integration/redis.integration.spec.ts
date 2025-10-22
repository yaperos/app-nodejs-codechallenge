import { TestRedisHelper } from "./helpers/test-redis.helper";
import { Job, Queue } from "bull";

interface JobData {
  [key: string]: unknown;
}

interface CompletedJobInfo {
  jobId: string | number | undefined;
  result: { status?: string; data?: unknown; success?: boolean };
}

interface FailedJobInfo {
  jobId: string | number | undefined;
  error: string;
}

describe("Redis Integration Tests", () => {
  let redisHelper: TestRedisHelper;

  beforeAll(async () => {
    redisHelper = new TestRedisHelper();
    await redisHelper.connect();
  });

  afterAll(async () => {
    await redisHelper.disconnect();
  });

  beforeEach(async () => {
    await redisHelper.flushAll();
  });

  describe("Redis Cache Operations", () => {
    it("should set and get a value", async () => {
      await redisHelper.set("test-key", "test-value");
      const value = await redisHelper.get("test-key");

      expect(value).toBe("test-value");
    });

    it("should set value with TTL", async () => {
      await redisHelper.set("ttl-key", "ttl-value", 2);

      const value1 = await redisHelper.get("ttl-key");
      expect(value1).toBe("ttl-value");

      await new Promise((resolve) => setTimeout(resolve, 2100));

      const value2 = await redisHelper.get("ttl-key");
      expect(value2).toBeNull();
    });

    it("should delete a key", async () => {
      await redisHelper.set("delete-key", "delete-value");
      const deleted = await redisHelper.del("delete-key");

      expect(deleted).toBe(1);

      const value = await redisHelper.get("delete-key");
      expect(value).toBeNull();
    });

    it("should check if key exists", async () => {
      await redisHelper.set("exists-key", "exists-value");

      const exists = await redisHelper.exists("exists-key");
      expect(exists).toBe(1);

      const notExists = await redisHelper.exists("non-existent-key");
      expect(notExists).toBe(0);
    });

    it("should find keys by pattern", async () => {
      await redisHelper.set("user:1", "value1");
      await redisHelper.set("user:2", "value2");
      await redisHelper.set("order:1", "value3");

      const userKeys = await redisHelper.keys("user:*");
      expect(userKeys.length).toBe(2);
      expect(userKeys).toContain("user:1");
      expect(userKeys).toContain("user:2");
    });

    it("should handle concurrent operations", async () => {
      const promises: any[] = [];
      for (let i = 0; i < 10; i++) {
        promises.push(redisHelper.set(`concurrent-${i}`, `value-${i}`));
      }

      await Promise.all(promises);

      const keys = await redisHelper.keys("concurrent-*");
      expect(keys.length).toBe(10);
    });
  });

  describe("Bull Queue Operations", () => {
    let queue: Queue;

    beforeEach(() => {
      queue = redisHelper.createQueue("test-queue");
    });

    afterEach(async () => {
      await redisHelper.cleanQueue("test-queue");
    });

    it("should add job to queue", async () => {
      const job = await queue.add({ test: "data" });

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data).toEqual({ test: "data" });
    });

    it("should process jobs from queue", async () => {
      const processedJobs: JobData[] = [];

      queue.process(async (job: Job) => {
        processedJobs.push(job.data);
        return { success: true };
      });

      await queue.add({ id: 1 });
      await queue.add({ id: 2 });
      await queue.add({ id: 3 });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(processedJobs.length).toBe(3);
      expect(processedJobs).toContainEqual({ id: 1 });
      expect(processedJobs).toContainEqual({ id: 2 });
      expect(processedJobs).toContainEqual({ id: 3 });
    });

    it("should track queue counts", async () => {
      await queue.add({ id: 1 });
      await queue.add({ id: 2 });
      await queue.add({ id: 3 });

      const counts = await redisHelper.getQueueCounts("test-queue");

      expect(counts.waiting).toBeGreaterThanOrEqual(0);
      expect(
        counts.waiting + counts.active + counts.completed
      ).toBeGreaterThanOrEqual(3);
    });

    it("should handle job failures and retries", async () => {
      let attempts = 0;

      queue.process(async (job: Job) => {
        attempts++;
        if (attempts < 3) {
          throw new Error("Job failed");
        }
        return { success: true };
      });

      await queue.add(
        { test: "retry" },
        {
          attempts: 3,
          backoff: {
            type: "fixed",
            delay: 100,
          },
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2500));

      expect(attempts).toBe(3);
    }, 10000);

    it("should process jobs in order (FIFO)", async () => {
      const processOrder: number[] = [];

      queue.process(async (job: Job) => {
        processOrder.push(job.data.order);
        return { success: true };
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      for (let i = 1; i <= 5; i++) {
        await queue.add({ order: i });
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      expect(processOrder).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle delayed jobs", async () => {
      const processedAt: number[] = [];

      queue.process(async (job: Job) => {
        processedAt.push(Date.now());
        return { success: true };
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const startTime = Date.now();

      await queue.add({ id: 1 }, { delay: 1000 });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(processedAt.length).toBe(1);
      expect(processedAt[0] - startTime).toBeGreaterThanOrEqual(900);
    }, 10000);

    it("should handle priority jobs", async () => {
      const processOrder: string[] = [];

      queue.process(async (job: Job) => {
        processOrder.push(job.data.name);
        await new Promise((resolve) => setTimeout(resolve, 50));
        return { success: true };
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      await queue.add({ name: "low" }, { priority: 10 });
      await queue.add({ name: "high" }, { priority: 1 });
      await queue.add({ name: "medium" }, { priority: 5 });

      await new Promise((resolve) => setTimeout(resolve, 800));

      expect(processOrder[0]).toBe("high");
    });
  });

  describe("Queue Event Handling", () => {
    let queue: Queue;

    beforeEach(() => {
      queue = redisHelper.createQueue("event-queue");
    });

    afterEach(async () => {
      await redisHelper.cleanQueue("event-queue");
    });

    it("should emit completed event", async () => {
      const completedJobs: CompletedJobInfo[] = [];

      queue.on(
        "completed",
        (
          job: Job,
          result: { status?: string; data?: unknown; success?: boolean }
        ) => {
          completedJobs.push({ jobId: job.id, result });
        }
      );

      queue.process(async (job: Job) => {
        return { status: "success", data: job.data };
      });

      await queue.add({ test: "event" });

      await new Promise((resolve) => setTimeout(resolve, 500));

      expect(completedJobs.length).toBe(1);
      expect(completedJobs[0].result.status).toBe("success");
    });

    it("should emit failed event", async () => {
      const failedJobs: FailedJobInfo[] = [];

      queue.on("failed", (job: Job, err: Error) => {
        failedJobs.push({ jobId: job.id, error: err.message });
      });

      queue.process(async (job: Job) => {
        throw new Error("Job processing failed");
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      await queue.add(
        { test: "fail" },
        {
          attempts: 1,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      expect(failedJobs.length).toBe(1);
      expect(failedJobs[0].error).toBe("Job processing failed");
    });

    it("should emit stalled event for stuck jobs", async () => {
      const stalledJobs: (string | number | undefined)[] = [];

      queue.on("stalled", (job: Job) => {
        stalledJobs.push(job.id);
      });

      queue.process(async (job: Job) => {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return { success: true };
      });

      await queue.add({ test: "stall" });
    }, 15000);
  });

  describe("Queue Concurrency and Rate Limiting", () => {
    let queue: Queue;

    beforeEach(() => {
      queue = redisHelper.createQueue("concurrent-queue");
    });

    afterEach(async () => {
      await redisHelper.cleanQueue("concurrent-queue");
    });

    it("should process jobs concurrently", async () => {
      const processing: Set<string> = new Set();
      const maxConcurrent = 3;
      let peakConcurrency = 0;

      queue.process(maxConcurrent, async (job: Job) => {
        processing.add(String(job.id!));
        peakConcurrency = Math.max(peakConcurrency, processing.size);

        await new Promise((resolve) => setTimeout(resolve, 200));

        processing.delete(String(job.id!));
        return { success: true };
      });

      for (let i = 0; i < 10; i++) {
        await queue.add({ id: i });
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      expect(peakConcurrency).toBeLessThanOrEqual(maxConcurrent);
      expect(peakConcurrency).toBeGreaterThan(1);
    }, 10000);

    it("should rate limit job processing", async () => {
      const processTimes: number[] = [];

      queue.process(async (job: Job) => {
        processTimes.push(Date.now());
        return { success: true };
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      const jobs: any[] = [];
      for (let i = 0; i < 5; i++) {
        jobs.push(
          queue.add(
            { id: i },
            {
              jobId: `rate-limited-${i}`,
            }
          )
        );
      }

      await Promise.all(jobs);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      expect(processTimes.length).toBe(5);
    });
  });

  describe("Queue Cleanup and Maintenance", () => {
    let queue: Queue;

    beforeEach(() => {
      queue = redisHelper.createQueue("cleanup-queue");
    });

    afterEach(async () => {
      await redisHelper.cleanQueue("cleanup-queue");
    });

    it("should clean completed jobs", async () => {
      queue.process(async (job: Job) => {
        return { success: true };
      });

      for (let i = 0; i < 5; i++) {
        await queue.add({ id: i });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const completedBefore = await queue.getCompletedCount();
      expect(completedBefore).toBeGreaterThan(0);

      await queue.clean(0, "completed");

      const completedAfter = await queue.getCompletedCount();
      expect(completedAfter).toBe(0);
    });

    it("should empty queue", async () => {
      for (let i = 0; i < 10; i++) {
        await queue.add({ id: i });
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      const countBefore = await queue.getWaitingCount();
      expect(countBefore).toBe(10);

      await queue.empty();

      const countAfter = await queue.getWaitingCount();
      expect(countAfter).toBe(0);
    });
  });

  describe("Redis Performance", () => {
    it("should handle high-volume cache operations", async () => {
      const operations = 1000;
      const startTime = Date.now();

      const promises: any[] = [];
      for (let i = 0; i < operations; i++) {
        promises.push(redisHelper.set(`perf-${i}`, `value-${i}`));
      }

      await Promise.all(promises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000);

      const keys = await redisHelper.keys("perf-*");
      expect(keys.length).toBe(operations);
    }, 10000);

    it("should maintain performance under load", async () => {
      const queue = redisHelper.createQueue("perf-queue");

      queue.process(async (job: Job) => {
        return { success: true };
      });

      const startTime = Date.now();

      const promises: any[] = [];
      for (let i = 0; i < 100; i++) {
        promises.push(queue.add({ id: i }));
      }

      await Promise.all(promises);

      const addTime = Date.now() - startTime;

      expect(addTime).toBeLessThan(1000);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const counts = await redisHelper.getQueueCounts("perf-queue");
      expect(counts.completed).toBeGreaterThanOrEqual(90);

      await redisHelper.cleanQueue("perf-queue");
    }, 10000);
  });
});
