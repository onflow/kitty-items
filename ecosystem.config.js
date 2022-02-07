<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Cleanup env config.
require("dotenv").config({
  path: ".env.dev"
});

<<<<<<< HEAD
=======
>>>>>>> Adds pm2 config.
=======
>>>>>>> Cleanup env config.
module.exports = {
  apps: [
    {
      name: "api",
      cwd: "./api",
      script: "npm",
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Cleanup env config.
      args: "run dev"
    },
    {
      name: "web",
      cwd: "./web",
      script: "npm",
      args: "run dev"
<<<<<<< HEAD
=======
      automation: false,
      args: "run dev",
      env: {
        NODE_ENV: "development",
        FLOW_ADDRESS: "",
        FLOW_PRIVATE_KEY: "",
        FUNGIBLE_TOKEN_ADDRESS: "",
        NON_FUNGIBLE_TOKEN_ADDRESS: "",
        METADATA_VIEWS_ADDRESS: "",
        NFT_STOREFRONT_ADDRESS: "",
        FLOW_TOKEN_ADDRESS: "",
        ACCESS_API_BACKEND: "",
        DATABASE_PATH: ""
      }
>>>>>>> Adds pm2 config.
=======
>>>>>>> Cleanup env config.
    }
  ]
};
