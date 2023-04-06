import Server from "./server/application/server";

function initializeApp() {
  const server = new Server();

  server.starUp();
}

initializeApp();
