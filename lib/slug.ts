import { customAlphabet } from "nanoid";

const alphabet = "23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";

export const generateSlug = customAlphabet(alphabet, 8);
export const generateEditToken = customAlphabet(alphabet, 32);
