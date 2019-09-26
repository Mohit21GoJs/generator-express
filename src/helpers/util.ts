import ext from "deep-extend";

export const appendToObj = (
  obj: Record<any, any>,
  val: Record<any, any>
): Record<any, any> => ext(obj, val);

interface ThisArg extends ThisType<{}> {
  log: (val: any) => void;
}
interface PromiseMap {
  key?: string;
  value: (args: Object) => Promise<any>;
  args: Object;
  thisArg: ThisArg;
  defaultVal?: any;
}

interface MappedPromiseFunc {
  promises: Array<PromiseMap>;
  reducer?: (val: any, value: any) => any;
}
const defaultReducer = (acc, { value, key }) => {
  return {
    ...acc,
    [key]: value
  };
};
// Non failure promise all with mapped results
export const mappedPromiseAll = async ({
  promises,
  reducer = defaultReducer
}: MappedPromiseFunc) => {
  const dataVals = await Promise.all(
    promises.map(async ({ key, thisArg, args, defaultVal = "", value }) => {
      let data = defaultVal;
      try {
        data = await value.call(thisArg, args);
      } catch (e) {
        // log error
      }
      return { key, value: data };
    })
  );

  return dataVals.reduce(reducer, {});
};

const concat = baseArr => obj => ({ ...baseArr, ...obj });
const promiseConcat = (f, thisArg, args) => async x => {
  const data = await f.call(thisArg, args);
  return concat(x)(data);
};
const promiseReduce = async (acc, x) => {
  const data = await acc;
  return promiseConcat(x.value, x.thisArg, x.args)(data);
};

const serial = funcs => funcs.reduce(promiseReduce, Promise.resolve([]));
export const mappedSequentialPromise = async ({
  promises
}: MappedPromiseFunc) => {
  return await serial(promises);
};
