import { json } from '@sveltejs/kit';
import { db } from '$lib/db.server';
import { event } from 'sveltekit-sse';
import { once, EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export function GET() {
	return event(async function run(emit) {
		while (true) {
			await once(eventEmitter, 'postReceived');
			emit(`${Date.now()}`);
		}
	}).toResponse();
}

export async function POST(evt) {
	const data = await evt.request.json();

	// data.phase1.sampleId = sample.id;
	data.phase1.phase = 1;
	data.phase2.phase = 2;
	data.phase3.phase = 3;

	// Create a new sample timestamp
	const sample = await db.sample.create({
		data: {
			PhaseData: {
				create: [data.phase1, data.phase2, data.phase3]
			}
		}
	});
	const digital_outputs = await db.digitalOutput.findMany();

	// Emit an event when a POST request is received
	eventEmitter.emit('postReceived');

	// return success
	return new Response(
		JSON.stringify({
			success: true,
			digital_outputs: digital_outputs
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
