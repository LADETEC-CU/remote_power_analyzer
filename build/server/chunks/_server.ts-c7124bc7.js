import './index-2b68e648.js';
import { d as db } from './db.server-1435d6b2.js';
import '@prisma/client';

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

export { POST };
//# sourceMappingURL=_server.ts-c7124bc7.js.map
