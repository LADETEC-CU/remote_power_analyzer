<script lang="ts">
	import { onMount } from 'svelte';

	let socket: WebSocket;
	let data = {
		voltages: { V1: 0, V2: 0, V3: 0 },
		currents: { I1: 0, I2: 0, I3: 0 },
		powers: { total_power: 0, reactive_power: 0, apparent_power: 0 }
	};

	onMount(() => {
		socket = new WebSocket('ws://localhost:8765');

		socket.onopen = () => {
			console.log('WebSocket connection established');
			requestData();
		};

		socket.onmessage = (event) => {
			data = JSON.parse(event.data);
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed');
		};

		return () => {
			if (socket) {
				socket.close();
			}
		};
	});

	function requestData() {
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send('get_data');
			setTimeout(requestData, 2000); // Request data every 2 seconds
		}
	}
</script>

<main class="text-center p-4 max-w-lg mx-auto">
	<h1 class="text-2xl mb-2">3-Phase Power Analyzer Data</h1>
	<table class="w-full border-collapse mt-4">
		<thead>
			<tr>
				<th class="border p-2 bg-gray-200">Parameter</th>
				<th class="border p-2 bg-gray-200">Phase 1</th>
				<th class="border p-2 bg-gray-200">Phase 2</th>
				<th class="border p-2 bg-gray-200">Phase 3</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="border p-2">Voltage (V)</td>
				<td class="border p-2">{data.voltages.V1}</td>
				<td class="border p-2">{data.voltages.V2}</td>
				<td class="border p-2">{data.voltages.V3}</td>
			</tr>
			<tr>
				<td class="border p-2">Current (I)</td>
				<td class="border p-2">{data.currents.I1}</td>
				<td class="border p-2">{data.currents.I2}</td>
				<td class="border p-2">{data.currents.I3}</td>
			</tr>
			<tr>
				<td class="border p-2">Total Power</td>
				<td class="border p-2" colspan="3">{data.powers.total_power}</td>
			</tr>
			<tr>
				<td class="border p-2">Reactive Power</td>
				<td class="border p-2" colspan="3">{data.powers.reactive_power}</td>
			</tr>
			<tr>
				<td class="border p-2">Apparent Power</td>
				<td class="border p-2" colspan="3">{data.powers.apparent_power}</td>
			</tr>
		</tbody>
	</table>
</main>

<style lang="postcss">
	:global(html) {
		@apply bg-gray-100;
	}
</style>
