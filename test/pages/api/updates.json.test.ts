import { expect, describe, test, vi, beforeEach, afterEach } from 'vitest';
vi.mock(import('rss-parser'), () => {
  return {
    default: class {
      parseString() {
        throw new Error('fake parser error');
      }
    }
  };
});


describe('Extract band data from rss feed', () => {
  const apiRouteEndpointAddress: string  = "https://openrss.org/feed/somebandname.bandcamp.com/music";
  let exampleRequest: Request;

  beforeEach(() => {
    exampleRequest = new Request('http://127.0.0.1/api/updates.json');
    vi.stubEnv('BAND_SEARCH_URL', apiRouteEndpointAddress);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  })

  test('It should fail without a configured API key to poll', async () => {
    vi.stubEnv('BAND_SEARCH_URL', '');

    const { GET } = await import('../../../src/pages/api/updates.json');
    // const expectedErrorMessage: string = 'BAND_SEARCH_URL is not configured';
    const apiResponse = await GET({
      request: exampleRequest
    } as any);

    expect(apiResponse).toBeInstanceOf(Response);
    expect(apiResponse.status).toBe(500);
  });

  test('It should form a request to the configured URL', async () => {
    const sampleRSSJson = {
      items: [
        {
          creator: 'noreply@cardinalsatthewindow.bandcamp.com (Various Artists)',
          title: 'Cardinals At The Window',
          link: 'https://cardinalsatthewindow.bandcamp.com/album/cardinals-at-the-window-2',
          pubDate: 'Thu, 17 Oct 2024 19:52:51 GMT',
          author: 'noreply@cardinalsatthewindow.bandcamp.com (Various Artists)',
          content: '<a href="https://cardinalsatthewindow.bandcamp.com/album/cardinals-at-the-window-2"><img src="https://f4.bcbits.com/img/a3357198849_10.jpg"></a><p>136 track album</p>\n',
          contentSnippet: '136 track album',
          guid: 'https://cardinalsatthewindow.bandcamp.com/album/cardinals-at-the-window-2',
          isoDate: '2024-10-17T19:52:51.000Z'
        }
      ],
      image: {
        link: 'https://f4.bcbits.com',
        url: 'https://f4.bcbits.com/img/0037339213_23.jpg',
        title: 'Cardinals At The Window'
      },
      title: 'Cardinals At The Window',
      description: 'Cardinals At The Window.\nNorth Carolina.',
      link: 'https://cardinalsatthewindow.bandcamp.com/music',
      language: 'en-us',
      lastBuildDate: 'Wed, 30 Sep 2026 12:56:22 GMT'
    };
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(sampleRSSJson),
      } as any);

    const { GET } = await import('../../../src/pages/api/updates.json');
    await GET({
      request: exampleRequest
    } as any);

    expect(fetchSpy)
      .toHaveBeenCalledWith(
        apiRouteEndpointAddress,
        {
          headers: { Accept: "application/rss+xml, application/xml, text/xml" }
        }
      );
  });

  test('It should return a 502 response if the target XML endpoint returns an error code', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 500,
    } as any);

    const { GET } = await import('../../../src/pages/api/updates.json');
    const apiResponse = await GET({
      request: exampleRequest
    } as any);
    const responseJson = await apiResponse.json();

    expect(apiResponse.status).toBe(502);
    expect(responseJson).toEqual(expect.objectContaining(
      { "error": expect.any(String) }
    ));
  });

  /** 
   * Required practise for OpenRSS developers polling programmatically on OpenRSS endpoints
   * 
   * @see https://openrss.org/guides/developers-guide-to-open-rss-feeds
   * */
  test.skip('It should respect the max-age headers of a response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ items: []}),
      headers: new Headers({ 'cache-control': 'max-age=300' })
    } as any);
    const mockSessionStorage = {
      get: vi.fn().mockReturnValue(''),
      set: vi.fn()
    };

    const { GET } = await import('../../../src/pages/api/updates.json');
    const apiResponse = await GET({
      request: exampleRequest
    } as any);

    expect(apiResponse.headers.get('cache-control')).toBe('max-age=300');
  });

  test('It should catch a parser error and return a 500 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
    } as any);
    const { GET } = await import('../../../src/pages/api/updates.json');
    const apiResponse = await GET({
      request: exampleRequest
    } as any);

    expect(apiResponse.status).toBe(500);
    expect(await apiResponse.json()).toEqual(
      expect.objectContaining({
        error: expect.any(String)
      }
    ));
  });
});