import ext from 'deep-extend';

interface ThisArgs extends ThisType<{}>{
    log: <U, W>(val: U) => W
}

export const appendToObj = <T extends {}, U extends {}>(obj?: T, val?: U): ReturnType<typeof ext> =>
    ext({ ...obj }, { ...val });

interface PromiseMap<T, U, W> {
    key: string;
    value: (args: T) => W;
    args: T;
    thisArg: ThisArgs;
    defaultVal?: W;
}

interface MappedPromiseFunc<T extends {}, U> {
    promises: Array<PromiseMap<{}, {}, string>>;
    reducer: (acc: T, value: U) => T;
}
const defaultReducer = (acc, { value, key }) => {
    return {
        ...acc,
        [key]: value,
    };
};
// Non failure promise all with mapped results
export const mappedPromiseAll = async ({
    promises,
    reducer,
}: MappedPromiseFunc<{}, { key: string; value: string }>) => {
    const dataVals = await Promise.all(
        promises.map(async ({ key, thisArg, args, defaultVal = '', value }) => {
            let data = defaultVal;
            try {
                data = await value.call(thisArg, args);
            } catch (e) {
                thisArg.log<typeof e, void>(e);
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
