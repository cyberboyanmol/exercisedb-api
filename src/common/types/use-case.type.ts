interface Obj {
  [key: string]: any
}

export interface IUseCase<T extends Obj | string | void = any, TRes = any> {
  execute: (params: T) => Promise<TRes>
}
