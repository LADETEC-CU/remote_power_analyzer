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

<main>
	<h1>3-Phase Power Analyzer Data</h1>
	<table>
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Phase 1</th>
				<th>Phase 2</th>
				<th>Phase 3</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Voltage (V)</td>
				<td>{data.voltages.V1}</td>
				<td>{data.voltages.V2}</td>
				<td>{data.voltages.V3}</td>
			</tr>
			<tr>
				<td>Current (I)</td>
				<td>{data.currents.I1}</td>
				<td>{data.currents.I2}</td>
				<td>{data.currents.I3}</td>
			</tr>
			<tr>
				<td>Total Power</td>
				<td colspan="3">{data.powers.total_power}</td>
			</tr>
			<tr>
				<td>Reactive Power</td>
				<td colspan="3">{data.powers.reactive_power}</td>
			</tr>
			<tr>
				<td>Apparent Power</td>
				<td colspan="3">{data.powers.apparent_power}</td>
			</tr>
		</tbody>
	</table>
</main>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 600px;
		margin: 0 auto;
	}
	h1 {
		font-size: 2em;
		margin-bottom: 0.5em;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1em;
	}
	th,
	td {
		border: 1px solid #ccc;
		padding: 0.5em;
		text-align: center;
	}
	th {
		background-color: #f4f4f4;
	}
</style>
