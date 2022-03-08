const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env;

export const dbConnection = {
  url: `mongodb://localhost:27017/adi`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
