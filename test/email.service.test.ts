// Mock the supabase module first (must be hoisted-safe)
jest.mock('../backend/src/lib/supabase', () => {
    // Create a shared mock query builder that maintains state
    let mockQueryBuilder: any;
    
    const createMockQueryBuilder = () => {
      mockQueryBuilder = {
        select: jest.fn(() => mockQueryBuilder),
        insert: jest.fn(() => mockQueryBuilder),
        update: jest.fn(() => mockQueryBuilder),
        delete: jest.fn(() => mockQueryBuilder),
        eq: jest.fn(() => mockQueryBuilder),
        neq: jest.fn(() => mockQueryBuilder),
        gt: jest.fn(() => mockQueryBuilder),
        gte: jest.fn(() => mockQueryBuilder),
        lt: jest.fn(() => mockQueryBuilder),
        lte: jest.fn(() => mockQueryBuilder),
        like: jest.fn(() => mockQueryBuilder),
        ilike: jest.fn(() => mockQueryBuilder),
        is: jest.fn(() => mockQueryBuilder),
        in: jest.fn(() => mockQueryBuilder),
        contains: jest.fn(() => mockQueryBuilder),
        containedBy: jest.fn(() => mockQueryBuilder),
        rangeGt: jest.fn(() => mockQueryBuilder),
        rangeGte: jest.fn(() => mockQueryBuilder),
        rangeLt: jest.fn(() => mockQueryBuilder),
        rangeLte: jest.fn(() => mockQueryBuilder),
        rangeAdjacent: jest.fn(() => mockQueryBuilder),
        overlaps: jest.fn(() => mockQueryBuilder),
        textSearch: jest.fn(() => mockQueryBuilder),
        filter: jest.fn(() => mockQueryBuilder),
        match: jest.fn(() => mockQueryBuilder),
        or: jest.fn(() => mockQueryBuilder),
        not: jest.fn(() => mockQueryBuilder),
        order: jest.fn(() => mockQueryBuilder),
        limit: jest.fn(() => mockQueryBuilder),
        range: jest.fn(() => Promise.resolve({ data: [], error: null })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
      };
      return mockQueryBuilder;
    };
  
    const mockSupabase = {
      from: jest.fn().mockImplementation(() => createMockQueryBuilder()),
      auth: {
        signInWithOAuth: jest.fn(),
        signOut: jest.fn(),
        session: jest.fn(),
        user: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    };
  
    return { supabase: mockSupabase };
  });
  
  // Now import real modules (after mock is in place)
  import { supabase } from '../backend/src/lib/supabase';
  import { EmailService } from '../backend/src/services/email.service';
  import { Email } from '../backend/src/types/email';
  
  // Helper to create a mock PostgrestQueryBuilder
  const createMockQueryBuilder = () => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
  });
  
  describe('EmailService', () => {
    const createMockEmail = (overrides: Partial<Email> = {}): Email => {
      const now = new Date();
      return {
        id: '1',
        userId: 'user123',
        gmailMessageId: 'msg1',
        threadId: 'thread1',
        subject: 'Test Email',
        fromAddress: 'test@example.com',
        toAddress: 'user@example.com',
        date: now,
        snippet: 'This is a test email',
        body: 'This is the full body of the test email',
        labels: ['INBOX'],
        isRead: false,
        isStarred: false,
        isDraft: false,
        isSpam: false,
        isTrash: false,
        createdAt: now,
        updatedAt: now,
        ...overrides,
      };
    };
  
    const mockEmail = createMockEmail();
  
    beforeEach(() => {
      jest.clearAllMocks();
      (supabase.from as jest.Mock).mockImplementation(() => createMockQueryBuilder());
    });
  
    describe('saveEmails', () => {
      it('should save emails to the database', async () => {
        const mockData = [{ id: '1' }];
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.insert.mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({ data: mockData, error: null }),
        });
  
        (supabase.from as jest.Mock).mockReturnValueOnce(mockQueryBuilder);
  
        const emailToSave = createMockEmail();
        const result = await EmailService.saveEmails([emailToSave]);
  
        expect(supabase.from).toHaveBeenCalledWith('emails');
        expect(mockQueryBuilder.insert).toHaveBeenCalled();
        expect(result).toEqual(['1']);
      });
  
      it('should throw an error if saving fails', async () => {
        const errorMessage = 'Failed to save emails';
        const mockError = new Error(errorMessage);
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.insert.mockReturnValueOnce({
          select: jest.fn().mockRejectedValueOnce(mockError),
        });
  
        (supabase.from as jest.Mock).mockReturnValueOnce(mockQueryBuilder);
  
        const emailToSave = createMockEmail();
        await expect(EmailService.saveEmails([emailToSave])).rejects.toThrow(errorMessage);
      });
    });
  
    describe('getUserEmails', () => {
      it('should fetch user emails with pagination', async () => {
        const mockData = [{ ...mockEmail, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.order.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.range.mockResolvedValueOnce({ data: mockData, error: null });
  
        (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);
  
        const result = await EmailService.getUserEmails('user123', { offset: 0, limit: 10 });
  
        expect(result).toEqual(mockData);
      });
  
      it('should filter unread emails', async () => {
        const mockData = [createMockEmail({ isRead: false })];
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.order.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.range.mockResolvedValueOnce({ data: mockData, error: null });
  
        (supabase.from as jest.Mock).mockReturnValue(mockQueryBuilder);
  
        const result = await EmailService.getUserEmails('user123', {
          offset: 0,
          limit: 10,
          isRead: false,
        });
  
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_read', false);
        expect(result).toEqual(mockData);
      });
    });
  
    describe('getEmail', () => {
      it('should fetch a single email by ID', async () => {
        const mockData = createMockEmail({ id: 'test-email-1' });
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.single.mockResolvedValueOnce({ data: mockData, error: null });
  
        (supabase.from as jest.Mock).mockReturnValueOnce(mockQueryBuilder);
  
        const result = await EmailService.getEmail('1');
  
        expect(result).toEqual(mockData);
      });
  
      it('should return null when email is not found', async () => {
        const mockQueryBuilder = createMockQueryBuilder();
        mockQueryBuilder.select.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.eq.mockReturnValue(mockQueryBuilder);
        mockQueryBuilder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
  
        (supabase.from as jest.Mock).mockReturnValueOnce(mockQueryBuilder);
  
        const result = await EmailService.getEmail('nonexistent-id');
  
        expect(result).toBeNull();
      });
    });
  });
  