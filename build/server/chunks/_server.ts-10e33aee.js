import './index-2b68e648.js';
import { d as db } from './db.server-1435d6b2.js';
import { EventEmitter, once } from 'events';
import '@prisma/client';

function createEmitter(controller) {
  let id = 1;
  const encoder = new TextEncoder();
  return function emit(eventName, data) {
    const typeOfEventName = typeof eventName;
    const typeOfData = typeof data;
    if (typeOfEventName !== "string") {
      throw new Error(
        `Event name must of type \`string\`, received \`${typeOfEventName}\`.`
      );
    }
    if (typeOfData !== "string") {
      throw new Error(
        `Event data must of type \`string\`, received \`${typeOfData}\`.`
      );
    }
    if (eventName.includes("\n")) {
      throw new Error(
        `Event name must not contain new line characters, received "${eventName}".`
      );
    }
    controller.enqueue(encoder.encode(`id: ${id}
event: ${eventName}
`));
    const chunks = data.split("\n");
    for (const chunk of chunks) {
      controller.enqueue(encoder.encode(`data: ${encodeURIComponent(chunk)}
`));
    }
    controller.enqueue(encoder.encode("\n"));
    id++;
  };
}
function createStream(producer, onCancel) {
  return new ReadableStream({
    async start(controller) {
      const customEmitter = createEmitter(controller);
      await producer(customEmitter);
      controller.close();
    },
    async cancel() {
      const self = this;
      for (const callback of onCancel) {
        await callback(self);
      }
    }
  });
}
function events(producer) {
  const onCancel = [];
  const headers = /* @__PURE__ */ new Map();
  let stream = void 0;
  return {
    /**
     * Set a response header.
     *
     * ### Note
     * The following headers are set by default for all events:
     * ```json
     * {
     *   "Cache-Control": "no-store",
     *   "Content-Type": "text/event-stream",
     *   "Connection": "keep-alive",
     * }
     * ```
     *
     * ### Warning
     * Overwriting the default headers is allowed.
     *
     * Overwriting header `Content-Type` to something other than `text/event-stream` will break the SSE contract and the event will stop working as intended.
     * @param {string} key
     * @param {string} value
     * @returns {ReturnType<events>}
     */
    setHeader(key, value) {
      headers.set(key, value);
      return this;
    },
    /**
     * Do something after the stream has been canceled.
     * @param {OnCancelCallback} callback
     * @returns {ReturnType<events>}
     */
    onCancel(callback) {
      onCancel.push(callback);
      return this;
    },
    /**
     * Get the underlying stream used by the event.
     * @returns {ReadableStream<string>}
     */
    getStream() {
      if (!stream) {
        stream = createStream(producer, onCancel);
      }
      return stream;
    },
    /**
     * Build a `Response`.
     * @returns {Response}
     */
    toResponse() {
      return new Response(this.getStream(), {
        //@ts-ignore
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/event-stream",
          "Connection": "keep-alive",
          ...headers
        }
      });
    }
  };
}
function event(producer) {
  return events(function run(emit) {
    return producer(function run2(data) {
      return emit("message", data);
    });
  });
}
const eventEmitter = new EventEmitter();
function GET() {
  return event(async function run(emit) {
    while (true) {
      await once(eventEmitter, "postReceived");
      emit(`${Date.now()}`);
    }
  }).toResponse();
}
async function POST(evt) {
  const data = await evt.request.json();
  data.phase1.phase = 1;
  data.phase2.phase = 2;
  data.phase3.phase = 3;
  await db.sample.create({
    data: {
      PhaseData: {
        create: [data.phase1, data.phase2, data.phase3]
      }
    }
  });
  const digital_outputs = await db.digitalOutput.findMany();
  eventEmitter.emit("postReceived");
  return new Response(
    JSON.stringify({
      success: true,
      digital_outputs
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export { GET, POST };
//# sourceMappingURL=_server.ts-10e33aee.js.map
