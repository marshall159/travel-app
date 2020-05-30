import { isValidURL } from '../client/js/isValidURL';

it('returns true for a valid URL', () => {
    const validURL = 'https://www.udacity.com';
    expect(isValidURL(validURL)).toBe(true);
});

it('returns false for an invalid URL', () => {
    const invalidURL = 'hps://www.udacity';
    expect(isValidURL(invalidURL)).toBe(false);
});