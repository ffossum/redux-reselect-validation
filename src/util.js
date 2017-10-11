/* @flow */
type Obj<A> = { [*]: A };

export function values<V>(obj: Obj<V>): V[] {
  return Object.keys(obj).map(key => obj[key]);
}

export function mapValues<A, B>(obj: Obj<A>, f: A => B): Obj<B> {
  const keys = Object.keys(obj);
  const result = {};
  keys.forEach(key => {
    result[key] = f(obj[key]);
  });
  return result;
}

export function every(as: any[]): boolean {
  for (let i = 0; i < as.length; ++i) {
    if (!as[i]) {
      return false;
    }
  }
  return true;
}
