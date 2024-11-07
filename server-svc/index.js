import express from "express";
import { KubeRPCClient, KubeRPCServer } from "kuberpc-sdk";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const RPC_HOST = process.env.RPC_HOST || "localhost";
const RPC_PORT = Number(process.env.RPC_PORT || 8082);
const HTTP_PORT = Number(process.env.HTTP_PORT || 8081);
const KUBERPC_CORE = process.env.KUBERPC_CORE;
const SERVICE_NAME = process.env.SERVICE_NAME;

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(HTTP_PORT, async () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
  await initRPCServer();
});

async function initRPCServer() {
  const kubeRPCServer = new KubeRPCServer({
    apiBaseURL: KUBERPC_CORE,
    port: RPC_PORT,
    serviceName: SERVICE_NAME,
  });

  await kubeRPCServer.initialize();

  await kubeRPCServer.registerSingleMethod({
    host: RPC_HOST,
    port: RPC_PORT,
    serviceName: SERVICE_NAME,
    method: {
      name: "test-method-01",
      params: ["param_one"],
      description: "Testing RPC",
      handler: testMethod,
    },
  });
}

function testMethod(...args) {
  return `Received: ${args.join(", ")}`;
}
