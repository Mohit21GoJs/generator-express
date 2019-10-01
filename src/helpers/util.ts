import ext from 'deep-extend';

interface ThisArgs<W> extends ThisType<{}>{
    log: (val?: string) => W;
}

export const appendToObj = <T extends {}, U extends {}>(obj?: T, val?: U): ReturnType<typeof ext> =>
    ext({ ...obj }, { ...val });

interface PromiseMap<T, U extends {}, W> {
    key?: string;
    value: (args: T) => U;
    args: T;
    thisArg: ThisArgs<void>;
    defaultVal?: W;
}

type Reducer<T,U> = (acc: T, value: U) => T;

interface MappedPromiseFunc<T extends {}, U, Answers> {
    promises: Array<PromiseMap<{}, Answers, string>>;
    reducer?: Reducer<T,U>
}
const defaultReducer = (acc, { value, key }) => {
    return {
        ...acc,
        [key]: value,
    };
};
// Non failure promise all with mapped results
export const mappedPromiseAll = async <Answers>({
    promises,
    reducer = defaultReducer
}: MappedPromiseFunc<{}, { key: string; value: {} }, Answers>) => {
    const dataVals = await Promise.all(
        promises.map(async ({ key, thisArg, args, defaultVal = {}, value }) => {
            let data = defaultVal;
            try {
                data = await value.call(thisArg, args);
            } catch (e) {
                thisArg.log(e);
            }
            return { key: key as string, value: data };
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
export const mappedSequentialPromise = async <Answers>({ promises }: MappedPromiseFunc<{}, {}, Answers>) => {
    return await serial(promises);
};
