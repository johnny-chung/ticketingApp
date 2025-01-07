import nats, { Stan } from "node-nats-streaming";

class NatsClient {
  private _client?: Stan;

  // use typescript getter to perform checking b4 exporting client
  // Not a func call : to use -> <instanceName>.client  
  get client() {
    if (!this._client) throw new Error("client not accessible");
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // return a promise to allow the async await syntax
    return new Promise<void>((resolve, reject) => {
      // use the getter instead of accessing this._client for ts safety
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
  
}

export const natsClient = new NatsClient();
