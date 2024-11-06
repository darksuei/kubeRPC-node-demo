import express from "express";
import {KubeRPCClient, KubeRPCServer} from "kuberpc-sdk";
const app = express();

const TCP_PORT = 8092;
const HTTP_PORT = 8091;

app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.listen(HTTP_PORT, async () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
  await initRPCClient();
});

async function initRPCClient() {
  const kubeRPCClient = new KubeRPCClient({
    apiBaseURL: "http://localhost:8080",
    timeout: 10000,
    retries: 2
  });

  await kubeRPCClient.initialize();

  console.log(await kubeRPCClient.getServices());
  console.log(await kubeRPCClient.getSingleService('test-svc-01'));

  const response = await kubeRPCClient.invokeMethod({
    serviceName: "test-svc-01",
    method: {
      name: "test-method-01",
      params: ["param_one", "param_two"],
    }
  });
  console.log(response)
}
