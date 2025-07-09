import "dotenv/config";

export default {
  expo: {
    name: "mobile",
    slug: "mobile-app",
    version: "1.0.0",
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
    },
  },
};
