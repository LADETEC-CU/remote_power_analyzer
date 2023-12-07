import { json } from '@sveltejs/kit';

// /api/sensor POST

export async function POST(event) {
	const data = await event.request.formData();
	const email = data.get('email');

	// subscribe the user to the newsletter
	console.log(email);

	// return success
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
