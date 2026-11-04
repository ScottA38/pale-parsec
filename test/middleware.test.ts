import type { APIContext } from 'astro';
import { vi, expect, describe, test, beforeEach, afterEach } from 'vitest';

// const { clerkClientMock } = vi.hoisted(() => {
//   return {
//     clerkClientMock:
//       (class {
//         private context: APIContext;
//         constructor(context: APIContext) {
//           this.context = context;
//         }

//         users =  {
//           getUser: vi.fn()
//         }

//         public updateUserPrivateMetadata = vi.fn() 
//       })
//   }
// });

const { clerkClientMock, getUserMock, updateUserMetadataMock } = vi.hoisted(() => {
  const getUserMock = vi.fn();
  const updateUserMetadataMock = vi.fn();

  const clerkClientMock = vi.fn(() => ({
    users: {
      getUser: getUserMock,
      updateUserMetadata: updateUserMetadataMock,
    },
  }));

  return { clerkClientMock, getUserMock, updateUserMetadataMock };
});

vi.mock('@clerk/astro/server', async (importOriginal) => {
  return {
    ...await importOriginal(),
    clerkClient: clerkClientMock
  } 
});

describe('User count middleware', () => {
  let exampleRequest: Request | null;

  beforeEach(() => {
    exampleRequest = (new Request(
      'http://localhost:4321/api/updates.json',
      {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
      }
    ));
  });

  afterEach(() => {
    exampleRequest = null;
    vi.clearAllMocks();
  });

  // unhappy-path test
  test('it should abort and metadata should remain the same when middleware function doesn\'t execute cleanly', async () => {
    const sampleContext = { request: exampleRequest } as unknown as APIContext;

    const { addPostCountToClerk } = await import('../src/middleware');
    addPostCountToClerk(sampleContext, async () => new Response('Failed', { status: 500 }));

    expect(getUserMock).not.toHaveBeenCalled();
    expect(updateUserMetadataMock).not.toHaveBeenCalled();
  });

  test('it should reject from updating metadata when user can\'t be found', async () => {
    const exampleUserId: string = '12321dskfjndsf';
    getUserMock.mockImplementation((userId: string) => {
      return {
        id: exampleUserId,
        username: 'test=1234567789',
        privateMetadata: { postCount: 0 }
      };
    });
  });

  // happy-path test
  test('should decrement`postCount` metadata when a successful DELETE request is intercepted', async () => {
    const exampleUserId: string = '12321dskfjndsf';
    getUserMock.mockImplementation((userId: string) => {
      return {
        id: exampleUserId,
        username: 'test=1234567789',
        privateMetadata: { postCount: 1 }
      };
    });

    // Mock a sample API Request payload
    const exampleRequest = new Request(`http://localhost:4321/api/update/${exampleUserId}`, { method: 'DELETE', });
    const sampleContext = { 
      request: exampleRequest,
      site: {
        host: 'localhost:4321',
      },
      locals: {
        auth: () => ({
          userId: exampleUserId
        })
      }
    } as unknown as APIContext;
    
    const { addPostCountToClerk } = await import('../src/middleware');
    await addPostCountToClerk(sampleContext, async () => new Response('ok'));

    expect(updateUserMetadataMock).toHaveBeenCalledOnce();
    expect(updateUserMetadataMock).toHaveBeenLastCalledWith(
      exampleUserId,
      expect.objectContaining({
        privateMetadata: {
          postCount: 0
        }
      })
    );
  });
  
  test('User count will be incremented when a successful POST request is intercepted', async () => {
    const exampleUserId: string = '12321dskfjndsf';
    getUserMock.mockImplementation((userId: string) => {
      return {
        id: exampleUserId,
        username: 'test=1234567789',
        privateMetadata: { postCount: 0 }
      };
    });
    // Mock a sample API Request payload
    const exampleRequest = new Request('http://localhost:4321/api/updates.json', {
      method: 'POST',
      body: "{ 'some': 5, 'dummy': 7, 'data': 0 }"
    });
    const sampleContext = { 
      request: exampleRequest,
      site: {
        host: 'localhost:4321',
      },
      locals: {
        auth: () => ({
          userId: exampleUserId
        })
      }
    } as unknown as APIContext;
    
    const { addPostCountToClerk } = await import('../src/middleware');
    await addPostCountToClerk(sampleContext, async () => new Response('ok'));

    expect(updateUserMetadataMock).toHaveBeenCalledOnce();
    expect(updateUserMetadataMock).toHaveBeenLastCalledWith(
      exampleUserId,
      expect.objectContaining({
        privateMetadata: {
          postCount: 1
        }
      })
    );
  });
});