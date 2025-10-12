// const getApiBaseUrl = () => {
//   const { protocol, hostname, port } = window.location;

//   // protocol = "http:"
//   // hostname = "192.168.1.109"
//   // port = "8000"

//   return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
// };

// export const port = getApiBaseUrl();



// config.js

const getCurrentConfig = () => {
  const { hostname, port } = window.location;
  console.log("Frontend running on:", hostname, port);

//   if (hostname === "http://192.168.1.109" && port === "8000") {
//     return {
//       port: "http://192.168.1.109:8000",
//     };
//   }

//   return {
//     port: "http://192.168.1.109:8000",
//   };
// };

if (hostname === "http://122.176.232.35:" && port === "8080") {
    return {
      port: "http://122.176.232.35:8080",
    };
  }

  return {
    port: "http://122.176.232.35:8080",
  };
};




const { port } = getCurrentConfig();

export { port };

