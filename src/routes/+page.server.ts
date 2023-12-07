import { error } from '@sveltejs/kit';
import { db } from '$lib/db.server';
/** @type {import('./$types').PageServerLoad} */

export async function load({ params }) {
	try {
		const sample = await db.sample.findFirst({
			orderBy: {
				id: 'desc' // Replace 'fieldName' with the field you want to sort by
			}
		});
		const phases = await db.phaseData.findMany({
			where: {
				sampleId: sample?.id
			}
		});
		console.log(sample.id, phases);
		return {
			measurement: {
				sample,
				phases
			}
		};
	} catch (err) {
		throw error(500, err);
	}
}
