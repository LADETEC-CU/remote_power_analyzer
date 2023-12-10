import { error } from '@sveltejs/kit';
import { db } from '$lib/db.server';
/** @type {import('./$types').PageServerLoad} */

export async function load({ params, depends }) {
	depends('app:sample');
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
		const powerHistory = await get_power();
		return {
			measurement: {
				sample,
				phases,
				powerHistory
			}
		};
	} catch (err) {
		throw error(500, err);
	}
}

async function get_power() {
	const now = new Date();
	now.setHours(now.getHours() - 6);
	const samples = await db.sample.findMany({
		take: 100,
		orderBy: {
			id: 'desc'
		}
	});
	const sampleIds = samples.map((sample) => sample.id); // Assuming the actual property is 'id', adjust if needed
	const phases = await db.phaseData.findMany({
		where: {
			sampleId: {
				in: sampleIds
			}
		},
		orderBy: {
			id: 'asc'
		}
	});
	const powerHistory: { [key: number]: number[] } = { 1: [], 2: [], 3: [] };
	phases.forEach(function (phase) {
		powerHistory[phase.phase].push(Math.round(phase.power));
	});
	return powerHistory;
}
