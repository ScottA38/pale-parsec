import { vi, expect, test, describe } from 'vitest';

const { setStoreKey, getStoreKey } = vi.hoisted(() => ({
  setStoreKey: vi.fn(),
  getStoreKey: vi.fn()
}));
vi.mock("@netlify/blobs", () => ({
  getStore: vi.fn().mockImplementation(() => ({
    get: getStoreKey,
    set: setStoreKey
  }))
}));

const apiEndpointUrl = 'http://localhost:4321/api/updates.json';
describe('band updates portal api', () => {
  test('it should reject a malformed request without uuid', async () => {
    const { POST } = await import('../../../src/pages/api/updates.json');
    const request = new Request(apiEndpointUrl, {
      method: 'POST',
      body: JSON.stringify({
        blog: {
          content: {
            title: 'New Tour Dates released again',
            subheading: 'On the Road again: Southport',
            body: 'Tour dates announced for next month',
            link: 'https://www.songkick.com/tour-dates',
            images: [ 'image-1.png', 'image-2.png', 'image-3.png' ],
            tags: ['update', 'tour', 'shows', 'performance', 'schedule']
          }
        }
      }),
    });
    const apiResponse: Response = await POST({ request });

    expect(apiResponse.status).toBe(400)
    expect(setStoreKey).not.toHaveBeenCalled()
  });

  test('it should allow the user to add a band update', async () => {
    const { POST } = await import('../../../src/pages/api/updates.json');
    const request = new Request(apiEndpointUrl, {
      method: 'POST',
      body: JSON.stringify({
        blog: {
          content: {
            uuid: 'a-uuid-string',
            title: 'New Tour Dates released again',
            subheading: 'On the Road again: Southport',
            body: 'Tour dates announced for next month',
            link: 'https://www.songkick.com/tour-dates',
            images: [ 'image-1.png', 'image-2.png', 'image-3.png' ],
            tags: ['update', 'tour', 'shows', 'performance', 'schedule']
          },
        }
      }),
    });

    const apiResponse: Response = await POST({ request });

    expect(apiResponse.status).toBe(200)
    expect(setStoreKey).toHaveBeenCalledOnce()
    expect(setStoreKey).toHaveBeenCalledWith(
      'a-uuid-string',
      expect.any(Blob)
    );
  });
});