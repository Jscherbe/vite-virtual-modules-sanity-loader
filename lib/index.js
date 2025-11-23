/**
 * @module @ulu/vite-virtual-modules-sanity-loader
 * @version 1.0.0
 * @description
 * A Vite virtual module loader for Sanity content. It handles data fetching, caching, and asset management for integration into Vite applications.
 */

import path from "path";
import { toJsonModule } from "@ulu/vite-plugin-virtual-modules";
import { createSanityLoader } from "@ulu/sanity-loader";

/**
 * @typedef {import('@ulu/sanity-loader').SanityLoader} SanityLoader
 * @typedef {import('@sanity/client').SanityClient} SanityClient
 * @typedef {import('@sanity/image-url/lib/types/builder').ImageUrlBuilder} ImageUrlBuilder
 */

/**
 * @typedef {object} SanityApi
 * @property {SanityClient} client - The configured Sanity client instance.
 * @property {(options: object) => () => { watch: string[], load: () => Promise<string> }} createLoader - Creates a virtual module loader.
 * @property {(source: object) => ImageUrlBuilder} imageUrl - The Sanity image URL builder instance.
 * @property {object} utils - Utility functions from the core loader.
 */

/**
 * Creates the main API instance for the Vite plugin.
 * @param {object} config - The configuration object. See `@ulu/sanity-loader` for core options.
 * @param {object} [config.viteVirtual] - Optional Vite virtual module configuration.
 * @param {string[]} [config.viteVirtual.watch] - Glob patterns for files to watch.
 * @returns {SanityApi} The API instance.
 */
export function createApi(config) {
  
  const sanityLoader = createSanityLoader(config);
  
  // Extract vite-specific config, as the core loader doesn't need it.
  const { viteVirtual: viteVirtualConfig = {} } = config;

  /**
   * Creates a loader function for a virtual module.
   * This function is intended to be used with `@ulu/vite-plugin-virtual-modules`.
   * @param {object} options - The loader options. See `defineLoader` in the core library.
   * @returns {() => { watch: string[], load: () => Promise<string> }} A loader function for the virtual module plugin.
   */
  function createLoader(options) {
    // Get the async function that returns the pure data from the core loader.
    const runLoader = sanityLoader.defineLoader(options);

    return () => ({
      watch: viteVirtualConfig.watch || [path.join(config.paths.queries, "**/*.groq")],
      async load() {
        const result = await runLoader();
        return toJsonModule(result);
      }
    });
  }

  return {
    client: sanityLoader.client,
    createLoader,
    imageUrl: sanityLoader.imageUrl,
    utils: sanityLoader.utils
  };
}
