import type { GatewayResponseFrame } from "./types";
import type { GatewayWsClient } from "./ws-client";

const RPC_TIMEOUT_MS = 5_000;

export interface ForceActionRpc {
  pauseAgent: (agentId: string) => Promise<void>;
  resumeAgent: (agentId: string) => Promise<void>;
  killAgent: (agentId: string) => Promise<void>;
  sendMessageToAgent: (agentId: string, text: string) => Promise<void>;
}

function sendRpc(
  client: GatewayWsClient,
  method: string,
  params: Record<string, unknown>,
): Promise<void> {
  if (!client.isConnected()) {
    return Promise.reject(new Error("未连接到 Gateway"));
  }

  return new Promise<void>((resolve, reject) => {
    const id = crypto.randomUUID();
    const timer = setTimeout(() => {
      reject(new Error("操作超时，Gateway 可能暂不支持此操作"));
    }, RPC_TIMEOUT_MS);

    client.onResponse(id, (frame: GatewayResponseFrame) => {
      clearTimeout(timer);
      if (frame.ok) {
        resolve();
      } else {
        reject(new Error(frame.error.message));
      }
    });

    client.send({ type: "req", id, method, params });
  });
}

export function createForceActionRpc(client: GatewayWsClient): ForceActionRpc {
  return {
    pauseAgent: (agentId: string) => sendRpc(client, "agent.pause", { agentId }),
    resumeAgent: (agentId: string) => sendRpc(client, "agent.resume", { agentId }),
    killAgent: (agentId: string) => sendRpc(client, "agent.kill", { agentId }),
    sendMessageToAgent: (agentId: string, text: string) =>
      sendRpc(client, "agent.message", { agentId, text }),
  };
}
