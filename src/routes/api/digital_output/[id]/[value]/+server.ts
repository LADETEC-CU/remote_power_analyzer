import { error } from '@sveltejs/kit';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export async function GET({ params }) {
	console.log(params);
	const digital_output = await prisma.digitalOutput.update({
		where: {
			id: +params.id
		},
		data: {
			value: params.value == 'true'
		}
	});

	if (digital_output) {
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	throw error(404, 'Not found');
}
