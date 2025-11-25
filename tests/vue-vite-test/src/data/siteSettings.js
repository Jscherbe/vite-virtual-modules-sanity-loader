import { sanityApi } from '../sanity/index.js';

export default sanityApi.defineLoader({
  queryName: 'siteSettings',
  cacheEnabled: true
});
