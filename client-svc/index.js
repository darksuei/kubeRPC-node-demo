import express from "express";
import { KubeRPCClient } from "kuberpc-sdk";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const HTTP_PORT = Number(process.env.HTTP_PORT || 8091);
const KUBERPC_CORE = process.env.KUBERPC_CORE;
const SERVICE_NAME = process.env.SERVICE_NAME;

app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});

app.listen(HTTP_PORT, async () => {
  console.log(`Server svc is running on port ${HTTP_PORT}`);
  await initRPCClient();
});

async function initRPCClient() {
  const kubeRPCClient = new KubeRPCClient({
    apiBaseURL: KUBERPC_CORE,
    timeout: 10000, // Timeout for any method invoke call.
    retries: 2, // Number of retries to make if the request fails.
  });

  await kubeRPCClient.initialize();

  console.log(await kubeRPCClient.getServices()); // Get all services registered with kuberpc-core
  console.log(await kubeRPCClient.getSingleService(SERVICE_NAME)); // Get a single service registered with kuberpc-core and associated methods.

  const response = await kubeRPCClient.invoke({
    // Invoke/call a method of a service
    serviceName: SERVICE_NAME,
    method: {
      name: "test-method-01-updated",
      params: ["param_one", "param_two"],
    },
  });
  console.log(response); // This would be the return value of the function/method call.
}
