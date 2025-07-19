export interface EmailError {
  userId: string;
  timestamp: string;
  message: string;
  stack?: string;
  context: {
    emailId?: string;
    operation?: string;
    retryCount?: number;
    [key: string]: any;
  };
  retryCount: number;
}

export interface RedisHealth {
  ok: boolean;
  latency: number;
  memoryUsage: number;
  error?: string;
}
