import { Stan } from "node-nats-streaming";

export const stan = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => {}) => {
          callback();
        }
      ),
  },
};
