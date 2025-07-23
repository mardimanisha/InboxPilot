import { Mock } from 'jest-mock';

type MockSupabase = {
  from: jest.Mock<any, any>;
  insert: jest.Mock<any, any>;
  update: jest.Mock<any, any>;
  delete: jest.Mock<any, any>;
  select: jest.Mock<any, any>;
  eq: jest.Mock<any, any>;
  neq: jest.Mock<any, any>;
  gt: jest.Mock<any, any>;
  gte: jest.Mock<any, any>;
  lt: jest.Mock<any, any>;
  lte: jest.Mock<any, any>;
  like: jest.Mock<any, any>;
  ilike: jest.Mock<any, any>;
  is: jest.Mock<any, any>;
  in: jest.Mock<any, any>;
  contains: jest.Mock<any, any>;
  containedBy: jest.Mock<any, any>;
  rangeGt: jest.Mock<any, any>;
  rangeGte: jest.Mock<any, any>;
  rangeLt: jest.Mock<any, any>;
  rangeLte: jest.Mock<any, any>;
  rangeAdjacent: jest.Mock<any, any>;
  overlaps: jest.Mock<any, any>;
  textSearch: jest.Mock<any, any>;
  filter: jest.Mock<any, any>;
  match: jest.Mock<any, any>;
  or: jest.Mock<any, any>;
  not: jest.Mock<any, any>;
};

const createMockFunction = () => {
  const fn = jest.fn() as jest.Mock;
  fn.mockReturnThis();
  return fn;
};

export const createMockSupabase = (): MockSupabase => ({
  from: createMockFunction(),
  insert: createMockFunction(),
  update: createMockFunction(),
  delete: createMockFunction(),
  select: jest.fn().mockResolvedValue({ data: [], error: null }),
  eq: createMockFunction(),
  neq: createMockFunction(),
  gt: createMockFunction(),
  gte: createMockFunction(),
  lt: createMockFunction(),
  lte: createMockFunction(),
  like: createMockFunction(),
  ilike: createMockFunction(),
  is: createMockFunction(),
  in: createMockFunction(),
  contains: createMockFunction(),
  containedBy: createMockFunction(),
  rangeGt: createMockFunction(),
  rangeGte: createMockFunction(),
  rangeLt: createMockFunction(),
  rangeLte: createMockFunction(),
  rangeAdjacent: createMockFunction(),
  overlaps: createMockFunction(),
  textSearch: createMockFunction(),
  filter: createMockFunction(),
  match: createMockFunction(),
  or: createMockFunction(),
  not: createMockFunction(),
});

// Create a default mock instance
export const mockSupabase = createMockSupabase();

// Export the type for use in tests
export type { MockSupabase };
