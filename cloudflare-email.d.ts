/**
 * Ambient module declaration for `cloudflare:email`. The module is supplied
 * at runtime by the Workers runtime when the `send_email` binding is declared;
 * there are no published types. Kept in its own file because `declare module`
 * in a file with top-level `export {}` is treated as augmentation, not
 * declaration.
 */
declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string)
  }
}
