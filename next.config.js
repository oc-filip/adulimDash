const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
          API_URL: "http://localhost:3000/api",
          MONGO_URI: "mongodb+srv://adulim:uMsoU1KgvAz9QwYf@cluster0.568vwt7.mongodb.net/AdulimDB?retryWrites=true&w=majority",
          JWT_SECRET: "ou5389nvx@'1=!lsdgkwrg",
          WC_URL: "https://adulim.co.il",
          WC_KEY: "ck_000269b103ee13e277528e5ee6ecc2525a4dbe5c",
          WC_SECRET: "cs_3cdfd0553ae2c8e3fe2b2ee46dbef946bc2fb86a",
      }
    } 
  }

  return {
      target: "experimental-serverless-trace",
      async headers() {
      return [
        {
          // matching all API routes
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
    },
    env: {
        //NEXTAUTH_URL :"https://dash.star.co.il",
        API_URL: "https://dash.star.co.il/api",
        MONGO_URI: "mongodb+srv://adulim:uMsoU1KgvAz9QwYf@cluster0.568vwt7.mongodb.net/AdulimDB?retryWrites=true&w=majority",
        JWT_SECRET: "ou5389nvx@'1=!lsdgkwrg",
        WC_URL: "https://adulim.co.il",
        WC_KEY: "ck_000269b103ee13e277528e5ee6ecc2525a4dbe5c",
        WC_SECRET: "cs_3cdfd0553ae2c8e3fe2b2ee46dbef946bc2fb86a",
    },
    async redirects() {
      return [
        {
          source: '/',
          destination: '/admin/dashboard',
          permanent: true,
        },
        
      ]
    }
    
  }  

}


