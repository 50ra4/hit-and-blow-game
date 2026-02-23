/**
 * 文字列配列を Zod enum 用の非空タプル型として返す
 *
 * Object.values() は string[] を返し as [string, ...string[]] のキャストが必要だが、
 * リテラル型が失われる。このユーティリティを使うことでリテラル型を保ったまま
 * 非空タプル型に変換できる。
 */
export const toNonEmptyArray = <T extends string>(arr: T[]): [T, ...T[]] => {
  const first = arr.at(0);
  if (first === undefined) {
    throw new Error('toNonEmptyArray: 配列が空です');
  }
  return arr as [T, ...T[]];
};
