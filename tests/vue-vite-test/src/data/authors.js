import { sanityApi } from '../sanity/index.js';

export default sanityApi.defineLoader({
  queryName: 'authors',
  cacheEnabled: true
});
