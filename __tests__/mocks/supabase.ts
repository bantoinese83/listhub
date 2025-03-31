export const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  execute: jest.fn(),
}

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: () => mockSupabaseClient,
})) 