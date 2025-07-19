export interface EmailMetrics {
  timestamp: string;
  queueLength: number;
  processingRate: number;
  redisHealth: RedisHealth;
}

export interface RedisHealth {
  ok: boolean;
  latency: number;
  memoryUsage: number;
  error?: string;
}

export interface EmailErrorStats {
  totalErrors: number;
  errorTypes: Record<string, number>;
}
