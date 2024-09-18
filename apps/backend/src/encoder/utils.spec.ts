import { caption } from './utils';
import { BaseChain } from 'langchain/chains';

jest.mock('@langchain/openai');
jest.mock('../config', () => ({
  appEnv: {
    ...jest.requireActual('../config').appEnv,
    OPENAI_ACCESS_TOKEN: 'foobar',
  },
}));
describe('caption function', () => {
  it('should return the captioned text', async () => {
    const mockResponse = { text: 'Mocked captioned text' };

    const mockInvoke = jest
      .spyOn(BaseChain.prototype, 'invoke')
      .mockResolvedValue(mockResponse);

    const result = await caption('mocked-image-url');

    expect(result).toBe('Mocked captioned text');
    expect(mockInvoke).toHaveBeenCalledWith({
      image: 'mocked-image-url',
    });
  });
});
