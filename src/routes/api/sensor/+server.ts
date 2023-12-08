import { json } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(evt) {
	const data = await evt.request.json();

	// data.phase1.sampleId = sample.id;
	data.phase1.phase = 1;
	data.phase2.phase = 2;
	data.phase3.phase = 3;

	// Create a new sample timestamp
	const sample = await prisma.sample.create({
		data: {
			PhaseData: {
				create: [data.phase1, data.phase2, data.phase3]
			}
		}
	});

	// return success
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
