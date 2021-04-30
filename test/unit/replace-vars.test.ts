import { replaceUrlPartialChunk } from '../../lib/replace-vars';

describe('replacePartialChunk', () => {
  const config = {
    RES_BODY_URL_SUB: 'http://replac.ed',
    BROKER_SERVER_URL: 'broker.com',
    BROKER_TOKEN: 'a-tok-en',
  };

  it('Replaces string completely in chunk', () => {
    const chunk =
      'Replace the "http://replac.ed/get/some/artifact" url please.';
    const prevPartial = null;
    const expectedChunk =
      'Replace the "broker.com/broker/a-tok-en/get/some/artifact" url please.';

    expect(replaceUrlPartialChunk(chunk, prevPartial, config)).toEqual({
      newChunk: expectedChunk,
      partial: undefined,
    });
  });

  it('Removes replace string that is partially at end of chunk', () => {
    const chunk = 'Replace the "http://repla';
    const prevPartial = null;
    const expectedChunk = 'Replace the "';

    expect(replaceUrlPartialChunk(chunk, prevPartial, config)).toEqual({
      newChunk: expectedChunk,
      partial: 'http://repla',
    });
  });

  it('Replaces partial at start of chunk if matched with prevPartial', () => {
    const chunk = 'c.ed/get/some/artifact" url please.';
    const prevPartial = 'http://repla';
    const expectedChunk =
      'broker.com/broker/a-tok-en/get/some/artifact" url please.';

    expect(replaceUrlPartialChunk(chunk, prevPartial, config)).toEqual({
      newChunk: expectedChunk,
      partial: undefined,
    });
  });

  it('Does not replace partial at start of chunk if not matched with prevPartial', () => {
    const chunk = 'ac.ed/get/some/artifact" url please.';
    const prevPartial = 'http://repla';
    const expectedChunk = 'http://replaac.ed/get/some/artifact" url please.';

    expect(replaceUrlPartialChunk(chunk, prevPartial, config)).toEqual({
      newChunk: expectedChunk,
      partial: undefined,
    });
  });
});
