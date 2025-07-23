import { Mock } from 'jest-mock';

declare global {
  // eslint-disable-next-line no-var
  var mockSupabase: {
    from: Mock;
    insert: Mock;
    update: Mock;
    delete: Mock;
    select: Mock;
    eq: Mock;
    neq: Mock;
    gt: Mock;
    gte: Mock;
    lt: Mock;
    lte: Mock;
    like: Mock;
    ilike: Mock;
    is: Mock;
    in: Mock;
    contains: Mock;
    containedBy: Mock;
    rangeGt: Mock;
    rangeGte: Mock;
    rangeLt: Mock;
    rangeLte: Mock;
    rangeAdjacent: Mock;
    overlaps: Mock;
    textSearch: Mock;
    filter: Mock;
    match: Mock;
    or: Mock;
    not: Mock;
  };
}

export {}; // This file needs to be a module
