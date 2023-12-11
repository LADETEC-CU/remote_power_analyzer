import { e as error } from './index-2b68e648.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function GET({ params }) {
  console.log(params);
  const digital_output = await prisma.digitalOutput.update({
    where: {
      id: +params.id
    },
    data: {
      value: params.value == "true"
    }
  });
  if (digital_output) {
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  throw error(404, "Not found");
}

export { GET };
//# sourceMappingURL=_server.ts-1b27e89d.js.map
