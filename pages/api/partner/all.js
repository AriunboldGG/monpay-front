import axios from '@/utils/axiosServer';

export default async function handler(req, res) {
  let allData = [];
  let total = 0;
  const firstResp = await fetcher(0).catch((error) => handleError(res, error));
  total = firstResp.data.total;
  allData = [...firstResp.data.result];
  if (total > 50) {
    const pages = Math.floor(total / 50);
    for (let i = 1; i <= pages; i++) {
      const resp = await fetcher(i * 50).catch((error) =>
        handleError(res, error)
      );
      allData = [...allData, ...resp.data.result];
    }
  }

  const allId = [];
  allData.map((data) => allId.push(data.partnerId));

  res.status(200).json({ list: allId });
}

export async function fetcher(offset) {
  return await axios.get(
    `/partners?limit=50&pagingStart=-1&includeTotal=true&offset=${offset}`
  );
}

async function handleError(res, error) {
  res
    .status(error.response ? error.response.status : 500)
    .json(error.response ? error.response.data : { info: 'Алдаатай хүсэлт' });
}
