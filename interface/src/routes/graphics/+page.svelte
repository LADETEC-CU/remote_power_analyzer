<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { user } from '$lib/stores/user';
	import { socket } from '$lib/stores/socket';
	import { page } from '$app/stores';
	import type { LightState } from '$lib/types/models';

	import PhasorChart from "$lib/components/chart-components/PhasorChart.svelte";
	import PowerChart from '$lib/components/chart-components/PowerChart.svelte';

	$: angIa = 0;
	$: angIb = 0;
	$: angIc = 0;

	let isSocketConnected = false;
	let timeout;
    
	$: lightState = {
		led_on: false,
		VA: 0,
		VB: 0,
		VC: 0,
		IA: 0,
		IB: 0,
		IC: 0,
		Pt: 0,
		PA: 0,
		PB: 0,
		PC: 0,
		Qt: 0,
		QA: 0,
		QB: 0,
		QC: 0,
		St: 0,
		SA: 0,
		SB: 0,
		SC: 0,
		pft: 0,
		pfA: 0,
		pfB: 0,
		pfC: 0,
		UAB: 0,
		UBC: 0,
		UCA: 0,
		fA: 0,
		fB: 0,
		fC: 0,
		pPenergy: 0,
		rPenergy: 0,
		pQenergy: 0,
		rQenergy: 0,
		tPenergy: 0,
		tQenergy: 0,
		isWorking: false,
		isMainPower: false,
		isStartFail: false,
		isBatteryOk: false,
		isBatteryLow: false,
		isBatteryHigh: false,
		isHighTemp: false,
		isLowOilPress: false,
		isOverSpeed: false,
		isOverVoltage: false,
		workingHours: 0,
		temperature: 0,
		batteryLevel: 0,
		oilPressure: 0,
		rpm: 0,
		modbusQualityTotalReads: 0,
		modbusQualityErrors: 0,
		modbusErrors: 0,
		modbusFails: 0,
		modbusState: false
	};

	function intermediateCalculation() {
		if (lightState.PA != 0)
				angIa = (Math.sign(lightState.QA) * Math.atan(Math.abs(lightState.QA)/lightState.PA)) * 180/Math.PI;
			else angIa = Math.sign(lightState.QA) * 90;
			if (lightState.PB != 0)
				angIb = Math.sign(lightState.QB) * Math.atan(Math.abs(lightState.QB)/lightState.PB) * 180/Math.PI;
			else angIb = Math.sign(lightState.QA) * 90;
			if (lightState.PC != 0)
				angIc = Math.sign(lightState.QC) * Math.atan(Math.abs(lightState.QC)/lightState.PC) * 180/Math.PI;
			else angIc = Math.sign(lightState.QA) * 90;

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
			lightState = light;
			intermediateCalculation();

			console.log("ppppp --> getLightState");

		} catch (error) {
			console.error('Error:', error);
		}
		return;
	}

	function requestData() {
		if (!isSocketConnected) {
			getLightstate();
		}
		isSocketConnected = false;
		timeout = setTimeout(requestData, 2500);
	}

	onMount(()=> {
		socket.on<LightState>('led', (merterData) => {
			lightState = merterData;
			isSocketConnected = true;
			intermediateCalculation();
			// console.log(lightState);
			// console.log(`${lightState.PB} ${lightState.QB} ${angIb.toFixed(2)} ${lightState.pfB}`);
		});
		timeout = setTimeout(requestData, 500); // Request data every 2 seconds
	});

	onDestroy(() => {
		socket.off('led');
		clearTimeout(timeout);
	});

</script>



<h3 class="header">Corrientes Trifásicas</h3>

<div class="phasors">
	<div class="c-phasor">Ic={lightState.IC.toFixed(1)}∠{angIc.toFixed(1)}&deg</div>
	<div class="b-phasor">Ib={lightState.IB.toFixed(1)}∠{angIb.toFixed(1)}&deg</div>
	<div class="a-phasor">Ia={lightState.IA.toFixed(1)}∠{angIa.toFixed(1)}&deg</div>
</div>

<!-- phasor diagram -->
<div class="phasor-diagram">
	<PhasorChart Iabs={[lightState.IA, lightState.IB, lightState.IC]} Iang={[angIa, angIb, angIc]}
	             phaseVoltages={[lightState.VA, lightState.VB, lightState.VC]} lineVoltages={[lightState.UAB, lightState.UBC, lightState. UCA]}/>
</div>

<h3 class="powers">Potencias</h3>

<!-- power triangle -->
<div class="power-diagrams" style="display: flex;">
	<div class="power-diagram" style="display: flex; justify-content: center; align-items: center; flex: 1;">
        <PowerChart P={lightState.Pt} Q={lightState.Qt} S={lightState.St} fp={lightState.pft} charWidth={240} chartHeight={384} />
    </div>
    <div class="power-diagram" style="display: flex; justify-content: center; align-items: center; flex-direction: column; flex: 1;">
		<div style="display: flex; justify-content: center; align-items: center; flex-direction: row; flex: 1;">
			<div style="writing-mode: vertical-rl; transform: rotate(180deg);">fase A</div>
		 	<PowerChart P={lightState.PA} Q={lightState.QA} S={lightState.SA} fp={lightState.pfA} charWidth={75} chartHeight={130}/>
		</div>
		<div style="display: flex; justify-content: center; align-items: center; flex-direction: row; flex: 1;">
			<div style="writing-mode: vertical-rl; transform: rotate(180deg);">fase B</div>
			<PowerChart P={lightState.PB} Q={lightState.QB} S={lightState.SB} fp={lightState.pfB} charWidth={75} chartHeight={130}/>
		</div>
		<div style="display: flex; justify-content: center; align-items: center; flex-direction: row; flex: 1;">
			<div style="writing-mode: vertical-rl; transform: rotate(180deg);">fase C</div>
			<PowerChart P={lightState.PC} Q={lightState.QC} charWidth={75} S={lightState.SC} fp={lightState.pfC} chartHeight={130}/>
		</div>
    </div>
</div>

<style>
	.header {
		font-weight: bold;
		text-align: center;
		margin: 0px 0px 10px ;
	}
	.phasors {
        display: flex;
        justify-content: space-between;
		margin: 0px 0px 10px 0px;
    }

    .c-phasor {
		color: green;
    }
	
	.b-phasor {
		color: blue;
    }
	
	.a-phasor {
		color: red;
    }
	.phasor-diagram {
        display: flex;
        justify-content: center;
    }

	.powers {
		font-weight: bold;
		text-align: center;
		margin: 20px 0px 0px 0px;
	}
</style>