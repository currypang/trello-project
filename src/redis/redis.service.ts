import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.redis = new Redis({
      url: this.configService.get('UPSTASH_REDIS_REST_URL'),
      token: this.configService.get('UPSTASH_REDIS_REST_TOKEN'),
    });
  }

  async set(key: string, value: any): Promise<void> {
    await this.redis.set(key, value);
  }

  async get(key: string): Promise<any | null> {
    return await this.redis.get(key);
  }
}
