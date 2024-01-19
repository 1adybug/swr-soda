import useSWR from "swr"
import type { PublicConfiguration, Revalidator, RevalidatorOptions, SWRResponse } from "swr/_internal"
export type { PublicConfiguration, Revalidator, RevalidatorOptions, SWRResponse } from "swr/_internal"

export type FetcherConfigWithoutArg<Data> = {
    fecther: () => Promise<Data>
}

export type FetcherConfigWithArg<Data, Arg> = {
    arg: Arg
    fecther: (arg: Arg) => Promise<Data>
}

export function fetcherWithoutArg<Data>(config: FetcherConfigWithoutArg<Data>): Promise<Data> {
    return config.fecther()
}

export function fetcherWithArg<Data, Arg>(config: FetcherConfigWithArg<Data, Arg>): Promise<Data> {
    return config.fecther(config.arg)
}

export type FetcherWithoutArg<Data> = (arg: FetcherConfigWithoutArg<Data>) => Promise<Data>

export type FetcherWithArg<Data, Arg> = (arg: FetcherConfigWithArg<Data, Arg>) => Promise<Data>

export type UseSWRWithArgOptions<Data, Arg> = Omit<PublicConfiguration<Data, any>, "fetcher" | "onLoadingSlow" | "onSuccess" | "onError" | "onErrorRetry"> & {
    fetcher?: FetcherWithArg<Data, Arg>
    onLoadingSlow: (key: string, config: Readonly<UseSWRWithArgOptions<Data, Arg>>) => void
    onSuccess: (data: Data, key: string, config: Readonly<UseSWRWithArgOptions<Data, Arg>>) => void
    onError: (err: any, key: string, config: Readonly<UseSWRWithArgOptions<Data, Arg>>) => void
    onErrorRetry: (err: any, key: string, config: Readonly<UseSWRWithArgOptions<Data, Arg>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void
}

export type UseSWRWithoutArgOptions<Data> = Omit<PublicConfiguration<Data, any>, "fetcher" | "onLoadingSlow" | "onSuccess" | "onError" | "onErrorRetry"> & {
    fetcher?: FetcherWithoutArg<Data>
    onLoadingSlow: (key: string, config: Readonly<UseSWRWithoutArgOptions<Data>>) => void
    onSuccess: (data: Data, key: string, config: Readonly<UseSWRWithoutArgOptions<Data>>) => void
    onError: (err: any, key: string, config: Readonly<UseSWRWithoutArgOptions<Data>>) => void
    onErrorRetry: (err: any, key: string, config: Readonly<UseSWRWithoutArgOptions<Data>>, revalidate: Revalidator, revalidateOpts: Required<RevalidatorOptions>) => void
}

export function useSoda<Data, Options extends Partial<UseSWRWithoutArgOptions<Data>> | undefined = undefined>(fetcher: FetcherWithoutArg<Data>, options?: Options): SWRResponse<Data, any, Options>
export function useSoda<Data, Arg, Options extends Partial<UseSWRWithArgOptions<Data, Arg>> | undefined = undefined>(arg: Arg, fetcher: FetcherWithArg<Data, Arg>, options?: Options): SWRResponse<Data, any, Options>
export function useSoda(argOrFecther: any, fetcherOrOprions?: any, options?: any) {
    if (typeof argOrFecther === "function" && typeof fetcherOrOprions !== "function") {
        return useSWR({ fetcher: argOrFecther }, fetcherWithoutArg, fetcherOrOprions)
    }
    return useSWR({ arg: argOrFecther, fetcher: fetcherOrOprions }, fetcherWithArg, options)
}

export default useSoda
