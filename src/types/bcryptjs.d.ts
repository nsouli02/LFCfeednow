declare module 'bcryptjs' {
  export function compareSync(data: string, encrypted: string): boolean;
  export function hashSync(data: string, saltOrRounds?: string | number): string;
  export function genSaltSync(rounds?: number): string;
  const _default: {
    compareSync: typeof compareSync;
    hashSync: typeof hashSync;
    genSaltSync: typeof genSaltSync;
  };
  export default _default;
}


