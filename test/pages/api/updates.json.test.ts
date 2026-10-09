import { vi, expect, test, describe } from 'vitest';

const { setStoreKey, getStoreKey, deleteStoreKey, listStore, uuidGenMock } = vi.hoisted(() => ({
  setStoreKey: vi.fn(),
  getStoreKey: vi.fn(),
  deleteStoreKey: vi.fn(),
  listStore: vi.fn(),
  uuidGenMock: vi.fn(),
}));

vi.mock("@netlify/blobs", () => ({
  getStore: vi.fn().mockImplementation(() => ({
    get: getStoreKey,
    set: setStoreKey,
    delete: deleteStoreKey,
    list: listStore
  }))
}));

vi.mock('uuid', () => ({
  v7: uuidGenMock.mockReturnValue('a-uuid-string'),
}));

const apiEndpointUrl = 'http://localhost:4321/api/updates.json';
describe('band updates portal api', () => {
  /** POST Requests */
  test('it should reject a request with malformed data', async () => {
    const { POST } = await import('../../../src/pages/api/updates.json');
    const request = new Request(apiEndpointUrl, {
      method: 'POST',
      body: JSON.stringify({
        blog: {
          content: {
            subheading: 'On the Road again: Southport',
            body: 'Tour dates announced for next month',
            author: 'a-fan-of-the-band',
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
            title: 'New Tour Dates released again',
            subheading: 'On the Road again: Southport',
            body: 'Tour dates announced for next month',
            author: 'a-fan-of-the-band',
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

  /** GET Requests */
  test('it should allow the user to retrieve all band updates', async () => {
    const mockBlobData = [
      {
        uuid: 'uuid-1',
        title: 'blob-1',
        subheading: "wysiwg",
        body: 'this is blob-1\'s content',
        link: "https://wysiwyg.com",
        images: ['image-1.jpg'],
        tags: ['tag-1', 'tag-2'],
      },
      {
        uuid: 'uuid-2',
        title: '2 blob 4u1 holmes',
        subheading: "gangsta",
        body: 'this is blob-2\'s content',
        link: "https://wysiwyg.two.com",
        images: ['extra-mints.refurb.jpg'],
        tags: ['tag-1', 'tag-2'],
      },
    ];
    listStore.mockResolvedValue({
      blobs: [{ key: 'ar4nd0mbl0bk3y1' }, { key: 'ar4nd0mbl0bk3y2' }]
    });
    getStoreKey.mockResolvedValueOnce(mockBlobData[0]);
    getStoreKey.mockResolvedValueOnce(mockBlobData[1]);
    const { GET } = await import('../../../src/pages/api/updates.json');
    const apiResponse: Response = await GET();

    expect(apiResponse.status).toBe(200);
    expect(await apiResponse.json()).toEqual(expect.arrayContaining([
      { 'ar4nd0mbl0bk3y1': expect.objectContaining(mockBlobData[0]) },
      { 'ar4nd0mbl0bk3y2': expect.objectContaining(mockBlobData[1]) }
    ]));
    expect(listStore).toHaveBeenCalledOnce();
    expect(getStoreKey).toHaveBeenCalledWith('ar4nd0mbl0bk3y1');
    expect(getStoreKey).toHaveBeenCalledWith('ar4nd0mbl0bk3y2');
  });
  
  /** DELETE requests */

  test('it should return error code when service fails to save blob', async () => {
    const blobId = '982342384723sdifjhsdf';
    const deleteRequest = new Request(`${apiEndpointUrl}/${blobId}`, { method: 'DELETE' });
    deleteStoreKey.mockRejectedValue({ error: 'API Key not found'});

    const { DELETE } = await import('../../../src/pages/api/update/[id].json');
    const apiResponse: Response = await DELETE({
      params: {},
      request: deleteRequest
    });

    expect(apiResponse.ok).toBe(false);
    expect(apiResponse.status).toBe(500);
  });

  test('it should delete the correct data payload when provided a blob id parameter', async () => {
    const blobId = '982342384723sdifjhsdf';
    const deleteRequest = new Request(`${apiEndpointUrl}/${blobId}`, { method: 'DELETE' });
    deleteStoreKey.mockResolvedValue(`deleted blob id ${blobId}`);

    const { DELETE } = await import('../../../src/pages/api/update/[id].json');
    const apiResponse: Response = await DELETE({
      params: {},
      request: deleteRequest
    });

    expect(deleteStoreKey).toHaveBeenCalled();
    expect(apiResponse.ok).toBeTruthy();
    expect(apiResponse.status).toBe(200);
  });
});