import ext from 'deep-extend';

export const appendToObj = <T extends {}, U extends {}>(obj?: T, val?: U): ReturnType<typeof ext> =>
    ext({ ...obj }, { ...val });

interface PromiseMap<T, U, W> {
    key?: string;
    value: (args: Record<string, T>) => W;
    args: Record<string, U>;
    thisArg: ThisType<{}>;
    defaultVal?: W;
}
interface MappedPromiseFunc<T extends {}, U> {
    promises: Array<PromiseMap<{}, {}, string>>;
    reducer?: (acc: T, value: U) => T;
}
const defaultReducer = (acc, { value, key  }) => {
    return {
        ...acc,
        [key]: value,
    };
};
// Non failure promise all with mapped results
export const mappedPromiseAll = async ({ promises, reducer = defaultReducer }: MappedPromiseFunc<{ key: string, value: string }, { key: string, value: string }>) => {
    const dataVals = await Promise.all(
        promises.map(async ({ key, thisArg, args, defaultVal = '', value }) => {
            let data = defaultVal;
            try {
                data = await value.call(thisArg, args);
            } catch (e) {
                // log error
            }
            return { key, value: data };
        }),
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
export const mappedSequentialPromise = async ({ promises }: MappedPromiseFunc<{}, {}>) => {
    return await serial(promises);
};
