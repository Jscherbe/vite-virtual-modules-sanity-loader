/**
 * @typedef {import('@ulu/sanity-loader').SanityLoader} SanityLoader
 * @typedef {import('@sanity/client').SanityClient} SanityClient
 * @typedef {import('@sanity/image-url/lib/types/builder').ImageUrlBuilder} ImageUrlBuilder
 */
/**
 * @typedef {object} VirtualModulesLoader
 * @property {SanityClient} client - The configured Sanity client instance.
 * @property {(options: object) => () => { watch: string[], load: () => Promise<string> }} defineLoader - Defines a virtual module loader.
 * @property {(source: object) => ImageUrlBuilder} imageUrl - The Sanity image URL builder instance.
 * @property {object} utils - Utility functions from the core loader.
 */
/**
 * Creates the main loader for Vite virtual modules.
 * @param {SanityLoader} sanityLoader - A pre-configured instance from `@ulu/sanity-loader`.
 * @param {object} [globalOptions] - Global configuration options for all loaders.
 * @param {string[]|null} [globalOptions.watch] - Glob patterns for files to watch. Set to `null` to disable watching by default.
 * @param {object} [globalOptions.watchOptions] - Default options for the file watcher (chokidar).
 * @param {string[]} [globalOptions.watchEvents] - Default events that trigger a reload.
 * @returns {VirtualModulesLoader} The virtual modules loader instance.
 */
export function createVirtualModulesLoader(sanityLoader: SanityLoader, globalOptions?: {
    watch?: string[] | null;
    watchOptions?: object;
    watchEvents?: string[];
}): VirtualModulesLoader;
export type SanityLoader = any;
export type SanityClient = import("@sanity/client").SanityClient;
export type ImageUrlBuilder = import("@sanity/image-url/lib/types/builder").ImageUrlBuilder;
export type VirtualModulesLoader = {
    /**
     * - The configured Sanity client instance.
     */
    client: SanityClient;
    /**
     * - Defines a virtual module loader.
     */
    defineLoader: (options: object) => () => {
        watch: string[];
        load: () => Promise<string>;
    };
    /**
     * - The Sanity image URL builder instance.
     */
    imageUrl: (source: object) => ImageUrlBuilder;
    /**
     * - Utility functions from the core loader.
     */
    utils: object;
};
//# sourceMappingURL=index.d.ts.map