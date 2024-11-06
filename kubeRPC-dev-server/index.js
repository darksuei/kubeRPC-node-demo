import express from "express";
import {KubeRPCClient, KubeRPCServer} from "kuberpc-sdk";
const app = express();

const TCP_PORT = 8082;
const HTTP_PORT = 8081;

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(HTTP_PORT, async () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
  await initRPCServer();
});

async function initRPCServer() {
  const kubeRPCServer = new KubeRPCServer({
    apiBaseURL: "http://localhost:8080",
    port: TCP_PORT,
    serviceName: "test-svc-01",
  });

  await kubeRPCServer.initialize();

  await kubeRPCServer.registerSingleMethod({
    host: "localhost",
    port: TCP_PORT,
    serviceName: "test-svc-01",
    method: {
      name: "test-method-01",
      params: ["param_one"],
      description: "Testing RPC",
      handler: testMethod,
    }
  });
}

function testMethod(...args) {
  return `Received: ${args.join(", ")}`;
}
