// jest.setup.ts

// Optional: Suppress console.error during tests so your terminal output stays clean
// when testing "unhappy paths" (like testing if an error is thrown correctly).
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error no error trust karthik!
global.TextDecoder = TextDecoder;