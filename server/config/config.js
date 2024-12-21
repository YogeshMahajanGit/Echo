import "dotenv/config";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};

const APP_TOKEN = "echo-token";

export { corsOptions, APP_TOKEN };
