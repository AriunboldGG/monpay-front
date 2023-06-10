import axios from '@/utils/axiosServer';

export default async function handler(req, res) {
  await axios
    .get(
      `/partners?pagingStart=-1&includeTotal=true` +
        (req?.query?.partnerCategoryId
          ? `&partnerCategoryId=${req.query.partnerCategoryId}`
          : '') +
        (req?.query?.offset ? `&offset=${req.query.offset}` : '') +
        (req?.query?.limit ? `&limit=${req.query.limit}` : '')
    )
    .then(
      (resp) => {
        res.status(200).json(resp.data);
      },
      (error) => {
        const resp = res
          .status(error.response ? error.response.status : 500)
          .json(
            error.response ? error.response.data : { info: 'Алдаатай хүсэлт' }
          );
      }
    );
}
