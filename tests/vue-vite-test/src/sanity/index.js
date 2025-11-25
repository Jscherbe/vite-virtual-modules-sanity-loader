/* global process */
import { createVirtualModulesLoader } from '@ulu/vite-virtual-modules-sanity-loader';
import { createSanityLoader } from '@ulu/sanity-loader';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// The user will create this file
dotenv.config({ path: ".env.local" });

// 1. Create a Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_STUDIO_API_TOKEN,
  useCdn: false, // `false` if you want to ensure fresh data
  apiVersion: '2023-05-03',
});

// 2. Create the core sanity loader instance
const sanityLoader = createSanityLoader({
  client: sanityClient,
  paths: {
    queries: './src/sanity/queries',
    assets: './public/assets/sanity',
    assetsPublic: '/assets/sanity'
  },
  // verbose: true // Enable logging for debugging
});

// 3. Create and export the virtual modules loader, passing in the sanity loader
export const sanityApi = createVirtualModulesLoader(sanityLoader);
