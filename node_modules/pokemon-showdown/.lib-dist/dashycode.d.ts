/**
 * Dashycode!
 *
 * Encodes a string in a restricted string containing only alphanumeric
 * characters and dashes.
 *
 * (The name is a riff on Punycode, which is what I originally wanted
 * to use for this purpose, but it turns out Punycode does not work on
 * arbitrary strings.)
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */
export declare function encode(str: string, allowCaps?: boolean): string;
export declare function decode(codedStr: string): string;
export declare function vizStream(codeBuf: string, translate?: boolean): string;
