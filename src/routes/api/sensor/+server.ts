import { json } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
// /api/sensor POST

export async function POST(event) {
	const data = await event.request.json();
	console.log(data);
	// Create a new sample timestamp
	const sample = await prisma.sample.create({});

	data.phase1.sampleId = sample.id;
	data.phase1.phase = 1;
	const phase_data1 = prisma.phaseData.create({
		data: data.phase1
	});
	data.phase2.sampleId = sample.id;
	data.phase2.phase = 2;
	const phase_data2 = prisma.phaseData.create({
		data: data.phase2
	});
	data.phase3.sampleId = sample.id;
	data.phase3.phase = 3;
	const phase_data3 = prisma.phaseData.create({
		data: data.phase3
	});
	// Create an array of the async functions.
	const promises = [phase_data1, phase_data2, phase_data3];
	await Promise.all(promises);
	// return success
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
