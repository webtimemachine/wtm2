import { jest } from '@jest/globals';
import { getQueryEntries } from './query-entries.js'
import { API_URL } from './consts.js';


describe('Should run all tests for getQueryEntries', () => {
    const user_info = {
        accessToken: 'mockAccessToken',
        user: {
            email: 'user-connected@mail.com',
        },
    };
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({}),
                ok: true,
            }),
        );
        global.chrome = {
            storage: {
                local: {
                    set: jest.fn(),
                },
            },
        };
    });

    test('should call fetch without the `query` query parameter', async () => {

        await getQueryEntries(user_info, API_URL, 0, 10, null);

        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/queries?offset=0&limit=10`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user_info.accessToken}`,
                }),
            }),
        );
    })

    test('should call fetch with the `query` query parameter', async () => {
        const user_info = {
            accessToken: 'mockAccessToken',
            user: {
                email: 'user-connected@mail.com',
            },
        };

        await getQueryEntries(user_info, API_URL, 0, 10, "foobar");

        expect(fetch).toHaveBeenCalledWith(
            `${API_URL}/api/queries?offset=0&limit=10&query=foobar`,
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user_info.accessToken}`,
                }),
            }),
        );
    })
})
