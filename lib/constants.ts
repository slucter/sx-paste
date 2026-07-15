export const MAX_CONTENT_LENGTH = 500_000;

// Worst case 4 bytes/char (UTF-8) plus slack for JSON envelope overhead.
export const MAX_BODY_BYTES = MAX_CONTENT_LENGTH * 4 + 1_024;

export const CREATE_RATE_LIMIT = { limit: 5, windowSeconds: 60 };
export const UPDATE_RATE_LIMIT = { limit: 20, windowSeconds: 60 };
