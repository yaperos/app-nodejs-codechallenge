import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AVRO_SCHEMAS, AvroTopic } from './constants';

interface CachedSchema {
  id: number;
  subject: string;
}

@Injectable()
export class SchemaRegistryService {
  private readonly logger = new Logger(SchemaRegistryService.name);
  private readonly registry: SchemaRegistry;
  private readonly schemaCache = new Map<AvroTopic, CachedSchema>();

  constructor(private readonly configService: ConfigService) {
    this.registry = new SchemaRegistry({
      host: this.configService.get<string>('schemaRegistry.url', ''),
    });
  }

  private async loadSchemaDefinition(topic: AvroTopic): Promise<string> {
    const details = AVRO_SCHEMAS[topic];
    if (!details) {
      throw new Error(`Schema not configured for topic ${topic}`);
    }

    const schemaPath = join(process.cwd(), ...details.file);
    return readFile(schemaPath, 'utf-8');
  }

  async getSchemaId(topic: AvroTopic): Promise<number> {
    const cached = this.schemaCache.get(topic);
    if (cached) {
      return cached.id;
    }

    const details = AVRO_SCHEMAS[topic];
    const schemaDefinition = await this.loadSchemaDefinition(topic);

    const { id } = await this.registry.register(
      {
        type: SchemaType.AVRO,
        schema: schemaDefinition,
      },
      { subject: details.subject },
    );

    this.schemaCache.set(topic, { id, subject: details.subject });
    this.logger.debug(`Registered schema for topic ${topic} with id ${id}`);
    return id;
  }

  async encode(topic: AvroTopic, payload: Record<string, unknown>): Promise<Buffer> {
    const schemaId = await this.getSchemaId(topic);
    return this.registry.encode(schemaId, payload);
  }

  async decode<T = Record<string, unknown>>(buffer: Buffer): Promise<T> {
    return (await this.registry.decode(buffer)) as T;
  }
}
