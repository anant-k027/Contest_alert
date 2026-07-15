const axios = require('axios');
require('dotenv').config({ path: '.env' });
(async () => {
  const url = `https://clist.by/api/v4/contest/?limit=1&resource_id__in=2,102`;
  const response = await axios.get(url, {
    headers: { Authorization: `ApiKey ${process.env.CLIST_USERNAME}:${process.env.CLIST_API_KEY}` }
  });
  console.log(response.data.objects[0].start);
})();
