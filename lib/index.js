/**
 * @module @ulu/vite-virtual-modules-sanity-loader
 * @version 1.0.0
 * @description
 * A Vite virtual module loader for Sanity content. It handles data fetching, caching, and asset management for integration into Vite applications.
 */

import path from "path";
import { toJsonModule } from "@ulu/vite-plugin-virtual-modules";
import { log } from "./logger.js";

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
export function createVirtualModulesLoader(sanityLoader, globalOptions = {}) {

  const defaultOptions = {
    watch: [
      path.join(sanityLoader.config.paths.queries, "**/*.groq")
    ]
    // No defaults for watchOptions or watchEvents, allowing the virtual module plugin's defaults to apply
  };

  const resolvedGlobalOptions = Object.assign({}, defaultOptions, globalOptions);

  if (sanityLoader.config.verbose) {
    log.log("Global options:", resolvedGlobalOptions);
  }

  /**
   * Defines a loader function for a virtual module.
   * This function is intended to be used with `@ulu/vite-plugin-virtual-modules`.
   * @param {object} loaderOptions - The loader options, which are a combination of core loader options and watch configurations.
   * @param {string[]|null} [loaderOptions.watch] - Glob patterns for this specific loader, overriding global settings.
   * @param {object} [loaderOptions.watchOptions] - Watcher options for this specific loader, overriding global settings.
   * @param {string[]} [loaderOptions.watchEvents] - Watch events for this specific loader, overriding global settings.
   * @returns {() => { watch: string[], load: () => Promise<string> }} A loader function for the virtual module plugin.
   */
  function defineLoader(loaderOptions = {}) {
    // Merge all options together to determine the final config
    const finalOptions = Object.assign({}, resolvedGlobalOptions, loaderOptions);
    
    // Separate all watch-related config from the options for the core loader
    const { watch, watchOptions, watchEvents, ...coreLoaderOptions } = finalOptions;

    if (sanityLoader.config.verbose) {
      log.log(`Defining loader with query "${coreLoaderOptions.queryName || "..."}"`, { watch, watchOptions, watchEvents, coreLoaderOptions });
    }

    const runLoader = sanityLoader.defineLoader(coreLoaderOptions);

    return () => ({
      watch,
      watchOptions,
      watchEvents,
      async load() {
        const result = await runLoader();
        return toJsonModule(result);
      }
    });
  }

  return {
    client: sanityLoader.client,
    defineLoader,
    imageUrl: sanityLoader.imageUrl,
    utils: sanityLoader.utils
  };
}
