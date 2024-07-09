<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { user } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { notifications } from '$lib/components/toasts/notifications';
	import SettingsCard from '$lib/components/SettingsCard.svelte';
	import Light from '~icons/tabler/bulb';
	import Info from '~icons/tabler/info-circle';
	import Save from '~icons/tabler/device-floppy';
	import Reload from '~icons/tabler/reload';
	import { socket } from '$lib/stores/socket';
	import type { LightState } from '$lib/types/models';

	// let socket: WebSocket;
	let data = {
		voltages: { VA: 4, VB: 2, VC: 0 },
		currents: { IA: 0, IB: 66, IC: 6 },
		powers: { active_power: 0, reactive_power: 8, apparent_power: 0 },
		energy: { activeTotalEnergy: 0, reactiveTotalEnergy: 0},
		frequency: 0
	};

	let lightState: LightState = { led_on: false, VA: 0, VB: 0, VC: 0, IA: 0, IB: 0, IC: 0, Pt: 0, Qt: 0, St: 0, tPenergy: 0, fA: 0 };

	let lightOn = false;

	function requestData() {
		// getLightstate();
		// setTimeout(requestData, 2000); // Request data every 2 seconds
		generateData();
		setTimeout(requestData, 1000); // Request data every 2 seconds

		// if (socket && socket.readyState === WebSocket.OPEN) {
		// 	socket.send('get_data');
		// 	setTimeout(requestData, 2000); // Request data every 2 seconds
		// }
	}

	function generateData() {
		data.voltages.VA = Math.floor(Math.random() * 41) + 200;
		data.voltages.VB = Math.floor(Math.random() * 41) + 200;
		data.voltages.VC = Math.floor(Math.random() * 41) + 200;
		data.currents.IA = Math.floor(Math.random() * 20) + 50;
		data.currents.IB= Math.floor(Math.random() * 20) + 50;
		data.currents.IC = Math.floor(Math.random() * 20) + 50;

		data.powers.active_power = Math.floor(Math.random() * 200) + 500;
		data.powers.reactive_power = - Math.floor(Math.random() * 500) + 250;
		data.powers.apparent_power = Math.floor(Math.random() * 300) + 800;;
		data.energy.activeTotalEnergy = Math.floor(Math.random() * 200) + 500;
		data.frequency = - Math.floor(Math.random() * 10) + 65;
	}

	async function getLightstate() {
		try {
			const response = await fetch('/rest/lightState', {
				method: 'GET',
				headers: {
					Authorization: $page.data.features.security ? 'Bearer ' + $user.bearer_token : 'Basic',
					'Content-Type': 'application/json'
				}
			});
			const light = await response.json();

			lightOn = light.led_on;

			data.voltages.VA = light.VA;
			data.voltages.VB = light.VB;
			data.voltages.VC = light.VC;
			data.currents.IA = light.IA;
			data.currents.IB= light.IB;
			data.currents.IC = light.IC;

			data.powers.active_power = light.Pt;
			data.powers.reactive_power = light.Qt;
			data.powers.apparent_power = light.St;
			data.energy.activeTotalEnergy = light.tPenergy;
			data.frequency = light.fA;

		} catch (error) {
			console.error('Error:', error);
		}
		return;
	}

	onMount(() => {
		// socket.on<LightState>('led', (merterData) => {
		// 	lightState = merterData;

		// 	lightOn = lightState.led_on;

		// 	data.voltages.VA = lightState.VA;
		// 	data.voltages.VB = lightState.VB;
		// 	data.voltages.VC = lightState.VC;
		// 	data.currents.IA = lightState.IA;
		// 	data.currents.IB= lightState.IB;
		// 	data.currents.IC = lightState.IC;

		// 	data.powers.active_power = lightState.Pt;
		// 	data.powers.reactive_power = lightState.Qt;
		// 	data.powers.apparent_power = lightState.St;
		// 	data.energy.activeTotalEnergy = lightState.tPenergy;
		// 	data.frequency = lightState.fA;

		// 	console.log("se pidio datos");
		// 	console.log(lightState);
		// });
		// getLightstate();

		requestData();

	});

	// onDestroy(() => socket.off('led'));

	async function postLightstate() {
		try {
			const response = await fetch('/rest/lightState', {
				method: 'POST',
				headers: {
					Authorization: $page.data.features.security ? 'Bearer ' + $user.bearer_token : 'Basic',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ led_on: lightOn })
			});
			if (response.status == 200) {
				notifications.success('Light state updated.', 30);
				const light = await response.json();
				lightOn = light.led_on;
			} else {
				notifications.error('User not authorized.', 30);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}


	// ------------------------------------------

	// import { onMount } from 'svelte';

	// onMount(() => {
	// 	socket = new WebSocket('ws://localhost:8765');

	// 	socket.onopen = () => {
	// 		console.log('WebSocket connection established');
	// 		requestData();
	// 	};

	// 	socket.onmessage = (event) => {
	// 		data = JSON.parse(event.data);
	// 	};

	// 	socket.onclose = () => {
	// 		console.log('WebSocket connection closed');
	// 	};

	// 	return () => {
	// 		if (socket) {
	// 			socket.close();
	// 		}
	// 	};
	// });

	

</script>

<!-- <SettingsCard collapsible={false}> -->
	<!-- <Light slot="icon" class="lex-shrink-0 mr-2 h-6 w-6 self-end" /> -->

	<main class="text-center p-4 max-w-lg mx-auto">
		<h1 class="text-2xl mb-2">3-Phase 55 Power Analyzer - Data</h1>
		<table class="w-full border-collapse mt-4">
			<thead>
				<tr >
					<th class="border p-2 bg-gray-200">Parameter</th>
					<th class="border p-2 bg-gray-200">Phase 1</th>
					<th class="border p-2 bg-gray-200">Phase 2</th>
					<th class="border p-2 bg-gray-200">Phase 3</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="border p-2">Voltage (V)</td>
					<td class="border p-2">{data.voltages.VA.toFixed(1)}</td>
					<td class="border p-2">{data.voltages.VB.toFixed(1)}</td>
					<td class="border p-2">{data.voltages.VC.toFixed(1)}</td>
				</tr>
				<tr>
					<td class="border p-2">Current (I)</td>
					<td class="border p-2">{data.currents.IA.toFixed(1)}</td>
					<td class="border p-2">{data.currents.IB.toFixed(1)}</td>
					<td class="border p-2">{data.currents.IC.toFixed(1)}</td>
				</tr>
				<tr>
					<td class="border p-2">Total Power</td>
					<td class="border p-2" colspan="3">{data.powers.active_power.toFixed(2)}</td>
				</tr>
				<tr>
					<td class="border p-2">Total Active Energy</td>
					<td class="border p-2" colspan="3">{data.energy.activeTotalEnergy.toFixed(2)}</td>
				</tr>
				<tr>
					<td class="border p-2">frequency</td>
					<td class="border p-2" colspan="3">{data.frequency.toFixed(2)}</td>
				</tr>
			</tbody>
		</table>
	</main>

	<!-- <span slot="title">Light State 33</span>
	<div class="w-full">
		<h1 class="text-xl font-semibold">REST Example</h1>
		<div class="alert alert-info my-2 shadow-lg">
			<Info class="h-6 w-6 flex-shrink-0 stroke-current" />
			<span>The form below controls the LED via the RESTful service exposed by the ESP device.</span
			>
		</div>
		<div class="flex flex-row flex-wrap justify-between gap-x-2">
			<div class="form-control w-52">
				<label class="label cursor-pointer">
					<span class="mr-4">Light State?</span>
					<input type="checkbox" bind:checked={lightOn} class="checkbox checkbox-primary" />
				</label>
			</div>
			<div class="flex-grow" />
			<button class="btn btn-primary inline-flex items-center" on:click={postLightstate}
				><Save class="mr-2 h-5 w-5" /><span>Save</span></button
			>
			<button class="btn btn-primary inline-flex items-center" on:click={getLightstate}
				><Reload class="mr-2 h-5 w-5" /><span>Reload</span></button
			>
		</div>
		<div class="divider" />
		<h1 class="text-xl font-semibold">Event Socket Example</h1>
		<div class="alert alert-info my-2 shadow-lg">
			<Info class="h-6 w-6 flex-shrink-0 stroke-current" />
			<span
				>The switch below controls the LED via the event system which uses WebSocket under the hood.
				It will automatically update whenever the LED state changes.</span
			>
		</div>
		<div class="form-control w-52">
			<label class="label cursor-pointer">
				<span class="">Light State?</span>
				<input
					type="checkbox"
					class="toggle toggle-primary"
					bind:checked={lightState.led_on}
					on:change={() => {
						socket.sendEvent('led', lightState);
					}}
				/>
			</label>
		</div>
	</div> -->
<!-- </SettingsCard> -->
