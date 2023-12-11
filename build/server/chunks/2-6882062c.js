import { e as error } from './index-2b68e648.js';
import { d as db } from './db.server-1435d6b2.js';
import '@prisma/client';

const ssr = false;

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ssr: ssr
});

async function load({ params, depends }) {
  depends("app:sample");
  try {
    const sample = await db.sample.findFirst({
      orderBy: {
        id: "desc"
        // Replace 'fieldName' with the field you want to sort by
      }
    });
    const phases = await db.phaseData.findMany({
      where: {
        sampleId: sample?.id
      }
    });
    const powerHistory = await get_power();
    const digital_outputs = await db.digitalOutput.findMany();
    return {
      measurement: {
        sample,
        phases,
        powerHistory,
        digital_outputs
      }
    };
  } catch (err) {
    throw error(500, err);
  }
}
async function get_power() {
  const now = /* @__PURE__ */ new Date();
  now.setHours(now.getHours() - 6);
  const samples = await db.sample.findMany({
    take: 100,
    orderBy: {
      id: "desc"
    }
  });
  const sampleIds = samples.map((sample) => sample.id);
  const phases = await db.phaseData.findMany({
    where: {
      sampleId: {
        in: sampleIds
      }
    },
    orderBy: {
      id: "asc"
    }
  });
  const powerHistory = { 1: [], 2: [], 3: [] };
  phases.forEach(function(phase) {
    powerHistory[phase.phase].push(Math.round(phase.power));
  });
  return powerHistory;
}

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-e0f8dea7.js')).default;
const universal_id = "src/routes/+page.ts";
const server_id = "src/routes/+page.server.ts";
const imports = ["_app/immutable/nodes/2.71207a7c.js","_app/immutable/chunks/scheduler.16cbcee3.js","_app/immutable/chunks/index.cb8f8d94.js","_app/immutable/chunks/singletons.52b7ddf2.js"];
const stylesheets = ["_app/immutable/assets/2.30edd2f1.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=2-6882062c.js.map
