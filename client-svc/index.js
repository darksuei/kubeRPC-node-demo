import express from "express";
import { KubeRPCClient, KubeRPCServer } from "kuberpc-sdk";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const RPC_PORT = Number(process.env.RPC_PORT || 8092);
const HTTP_PORT = Number(process.env.HTTP_PORT || 8091);
const KUBERPC_CORE = process.env.KUBERPC_CORE;
const SERVICE_NAME = process.env.SERVICE_NAME;

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(HTTP_PORT, async () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
  await initRPCClient();
});

async function initRPCClient() {
  const kubeRPCClient = new KubeRPCClient({
    apiBaseURL: KUBERPC_CORE,
    timeout: 10000,
    retries: 2,
  });

  await kubeRPCClient.initialize();

  console.log(await kubeRPCClient.getServices());
  console.log(await kubeRPCClient.getSingleService(SERVICE_NAME));

  const response = await kubeRPCClient.invokeMethod({
    serviceName: SERVICE_NAME,
    method: {
      name: "test-method-01",
      params: ["param_one", "param_two"],
    },
  });
  console.log(response);
}
