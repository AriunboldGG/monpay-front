export const errorHandler = (res, error) => {
  res.status(error.response ? error.response.status : 500).json(
    error.response
      ? error.response.data
      : {
          info:
            headers['Accept-Language'] === 'en'
              ? 'Request Failed'
              : 'Алдаатай хүсэлт',
        }
  );
};
