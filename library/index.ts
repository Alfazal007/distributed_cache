import { Cache } from "./cacheClass";

/**
 * This function creates all necessary connections to the server
 * This function is supposed to be called first before calling any other functions
 * @param host - Ip address or url of the master node
 * @returns Cache server using which other functions can be called
 */
export function connect(host: string) {
    Cache.connect(host)
    return Cache
}
