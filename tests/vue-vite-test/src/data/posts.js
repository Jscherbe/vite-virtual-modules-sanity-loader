import { sanityApi } from '../sanity/index.js';

export default sanityApi.defineLoader({
  queryName: 'posts',
  cacheEnabled: true
});
