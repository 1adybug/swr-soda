import useSWR from "swr"
import type { Middleware, PublicConfiguration, Revalidator, RevalidatorOptions, SWRResponse } from "swr/_internal"
export { unstable_serialize, default as useSWR } from "swr"
export * from "swr/_internal"

export type FetcherConfigWithoutArg<Data = any> = {
    fetcher: () => Data | Promise<Data>
}

export type FetcherConfigWithArg<Data = any, Arg = any> = {
    arg: Arg
    fetcher: (arg: Arg) => Data | Promise<Data>
}

export async function fetcherWithoutArg<Data = any>(config: FetcherConfigWithoutArg<Data>): Promise<Data> {
    return config.fetcher()
}

export async function fetcherWithArg<Data = any, Arg = any>(config: FetcherConfigWithArg<Data, Arg>): Promise<Data> {
    return config.fetcher(config.arg)
}

export type FetcherWithoutArg<Data = any> = (arg: FetcherConfigWithoutArg<Data>) => Promise<Data>

export type FetcherWithArg<Data = any, Arg = any> = (arg: FetcherConfigWithArg<Data, Arg>) => Promise<Data>

export type WithArgOptions<Data = any, Arg = any> = Omit<PublicConfiguration<Data, any>, "fetcher" | "onLoadingSlow" | "onSuccess" | "onError" | "onErrorRetry"> & {
    fetcher?: FetcherWithArg<Data, Arg>
    onLoadingSlow: (key: string, config: Readonly<WithArgOptions<Data, Arg>>) => void
    onSuccess: (data: Data, key: string, config: Readonly<WithArgOptions<Data, Arg>>) => void
    onError: (err: any, key: string, config: Readonly<WithArgOptions<Data, Arg>>) => void
    onErrorRetry: (err: any, key: string, config: Readonly<WithArgOptions<Data, Arg>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void
}

export type WithoutArgOptions<Data = any> = Omit<PublicConfiguration<Data, any>, "fetcher" | "onLoadingSlow" | "onSuccess" | "onError" | "onErrorRetry"> & {
    fetcher?: FetcherWithoutArg<Data>
    onLoadingSlow: (key: string, config: Readonly<WithoutArgOptions<Data>>) => void
    onSuccess: (data: Data, key: string, config: Readonly<WithoutArgOptions<Data>>) => void
    onError: (err: any, key: string, config: Readonly<WithoutArgOptions<Data>>) => void
    onErrorRetry: (err: any, key: string, config: Readonly<WithoutArgOptions<Data>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void
}

export function useSoda<Data, Options extends Partial<WithoutArgOptions<Data>> | undefined = undefined>(fetcher: () => Data | Promise<Data>, options?: Options): SWRResponse<Data, any, Options>
export function useSoda<Data, Arg, Options extends Partial<WithArgOptions<Data, Arg>> | undefined = undefined>(arg: Arg, fetcher: (arg: NonNullable<Arg>) => Data | Promise<Data>, options?: Options): SWRResponse<Data, any, Options>
export function useSoda(argOrFecther: any, fetcherOrOprions?: any, options?: any) {
    if (argOrFecther === null) {
        return useSWR(null, fetcherWithArg, options)
    }
    if (typeof argOrFecther === "function" && typeof fetcherOrOprions !== "function") {
        return useSWR({ fetcher: argOrFecther }, fetcherWithoutArg, fetcherOrOprions)
    }
    return useSWR({ arg: argOrFecther, fetcher: fetcherOrOprions }, fetcherWithArg, options)
}

export default useSoda

export const sodaMiddleware: Middleware = function SodaMiddleware(useSWRNext) {
    return function sodaMiddlewareWrapper(key, fetcher, config) {
        if (key === null) return useSWRNext(key, fetcherWithArg, config)
        return useSWRNext({ key, fetcher }, fetcherWithArg, config)
    }
}

export const sodaInfiniteMiddleware: Middleware = function SodaInfiniteMiddleware(useSWRNext) {
    return function sodaInfiniteMiddlewareWrapper(key, fetcher, config) {
        function getKey(pageIndex: number, previousPageData: any) {
            const _key = (key as Function)(pageIndex, previousPageData)
            if (_key === null) return null
            return { key: _key, fetcher }
        }
        return useSWRNext(getKey, fetcherWithArg, config)
    }
}
