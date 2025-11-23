# `@ulu/vite-virtual-modules-sanity-loader`

[![npm version](https://img.shields.io/npm/v/@ulu/vite-virtual-modules-sanity-loader.svg)](https://www.npmjs.com/package/@ulu/vite-virtual-modules-sanity-loader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Vite plugin that wraps [`@ulu/sanity-loader`](https://github.com/Jscherbe/sanity-loader) to expose Sanity.io content as virtual modules in Vite applications, designed for use with [`@ulu/vite-plugin-virtual-modules`](https://github.com/Jscherbe/vite-plugin-virtual-modules).

This plugin allows you to fetch content from Sanity.io at build time and expose it to your application as virtual modules, which can be imported like any other ES module. It handles data fetching, caching, and asset management under the hood.

## Core Concepts

This library is a bridge between the core [`@ulu/sanity-loader`](https://github.com/Jscherbe/sanity-loader) and your Vite project, leveraging the file-based approach of `@ulu/vite-plugin-virtual-modules`.

The workflow is as follows:
1.  You create a central `sanity.js` file in your project's build context to configure and export a `sanityApi` instance.
2.  In your `src`, you create a "loader" file (e.g., `src/data/siteSettings.js`). This file imports the `sanityApi` and uses its `createLoader` method to generate its default export.
3.  In your application, you import the loader file with the `?virtual-module` suffix.
4.  At build time, `@ulu/vite-plugin-virtual-modules` executes your loader, which uses `@ulu/sanity-loader` to fetch data and generate the final module content.

## Installation

This package has `peerDependencies` on `vite` and `@sanity/client`, which you should have installed in your project.

```bash
npm install @ulu/vite-virtual-modules-sanity-loader @ulu/sanity-loader @ulu/vite-plugin-virtual-modules @sanity/client
```

## Quick Start

Here’s how to set up the loader using the file-based approach.

### 1. Project Setup

Let's assume you have a project structure like this:

```
.
├── build/
│   └── sanity.js         // Central API setup lives here
├── queries/
│   └── siteSettings.groq
├── src/
│   ├── data/
│   │   └── siteSettings.js   // This will be our virtual module loader
│   └── main.js
└── vite.config.js
```

### 2. Vite Configuration

Your `vite.config.js` is simple. It only needs to register the virtual modules plugin.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import virtualModules from '@ulu/vite-plugin-virtual-modules';

export default defineConfig({
  plugins: [
    virtualModules()
  ]
});
```

### 3. Sanity API Setup

Create a central file to configure your connection to Sanity. This code runs in Node.js.

```javascript
// build/sanity.js
import { createApi } from '@ulu/vite-virtual-modules-sanity-loader';
import { createClient } from '@sanity/client';
import path from 'path';

// 1. Create a Sanity client
const sanityClient = createClient({
  projectId: 'your-project-id',
  dataset: 'your-dataset',
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2023-05-03',
});

// 2. Create and export the API instance
export const sanityApi = createApi({
  client: sanityClient,
  paths: {
    queries: path.resolve(process.cwd(), 'queries'),
    cache: path.resolve(process.cwd(), 'node_modules/.cache/sanity'),
    assetsFs: path.resolve(process.cwd(), 'public/assets/sanity'),
    assetsPublic: '/assets/sanity'
  },
  verbose: true // Enable logging for debugging
});
```

### 4. Create the Virtual Module Loader

This file imports the `sanityApi` and uses it to create a loader for a specific piece of data.

```javascript
// src/data/siteSettings.js
import { sanityApi } from '../../build/sanity.js';

// createLoader returns a function that becomes this module's default export.
// This is what @ulu/vite-plugin-virtual-modules will execute.
export default sanityApi.createLoader({
  queryName: 'siteSettings', // From queries/siteSettings.groq
  cacheEnabled: true
});
```

### 5. Use in Your Application

Now, import the loader file in your application with the `?virtual-module` suffix.

```javascript
// src/main.js
import siteSettings from './data/siteSettings.js?virtual-module';

console.log(siteSettings.siteTitle);
```

## API Reference

### `createApi(config)`

This function is the main entry point. It accepts a configuration object that is passed directly to `createSanityLoader` from the core [`@ulu/sanity-loader`](https://github.com/Jscherbe/sanity-loader) library. See the [**core library's documentation**](https://github.com/Jscherbe/sanity-loader#configuration-createsanityloader) for all available options.

### `sanityApi.createLoader(options)`

This is a factory function that generates the entire default export needed by a loader file for `@ulu/vite-plugin-virtual-modules`. It accepts the same options as `defineLoader` from the core library.

See the [**`@ulu/sanity-loader` documentation**](https://github.com/Jscherbe/sanity-loader#creating-loaders-defineloaders) for all available loader options. The `createLoader` function automatically wraps the result in a JSON module for you.

All other utilities (`imageUrl`, `utils`, `client`) are available on the `sanityApi` object and are passed through from the core loader.

## License

MIT
