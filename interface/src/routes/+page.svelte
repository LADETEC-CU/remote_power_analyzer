<script lang="ts">

	// import Ampmeter from "./Ampmeter.svelte";

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

	import Voltmeter from "./Voltmeter.svelte";
	import Freqmeter from "./Freqmeter.svelte";
	import StatusLedPanel from './StatusLedPanel.svelte';
	import ODO from "./ODO.svelte"
	import CarThermometer from "./CarThermometer.svelte";
	import CarVoltmeter from "./CarVoltmeter.svelte";
	import CarOilPressuremeter from "./CarOilPressuremeter.svelte";

	let simulation = false;

	let lightState: LightState = {
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


	$: mag = 15.8;
	$: f = 60;
	$: temperature = 45;
	$: batteryVoltage = 0;
	$: oilPressure = -0.3;
	
	let area: HTMLDivElement;
    let a_ancho;
    let a_alto;
	
	$: voltageToShow = 0;
	$: voltages = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	$: ledStatus = [false, false, false, false, false, false, false, false, false, false];

	let workingHours = 0;
	$: hoursRunning = 0;
	$: hoursRunningDecimal = 0;
	let nrd = 5;
	let dure = 200;

	$: ancho = 140;
	$: alto = 140;

	// for volt/amp meter
	let x0 = 0;
	let max = 300;
	let units = "V";
	let varName = "Va";

	const variable = ['Va', 'Vb', 'Vc', 'Vab', 'Vbc', 'Vca', 'Ia', 'Ib', 'Ic'];
	const colors = ['rgb(113, 170, 255)', 'rgb(113, 185, 255)', 'rgb(113, 200, 255)', 
	                'rgb(181, 144, 255)', 'rgb(201, 144, 255)', 'rgb(221, 144, 255)',
				    'rgb(255, 183, 113)', 'rgb(255, 188, 113)', 'rgb(255, 193, 113)'];
	let selected = colors[0];

    
	function intermdiateCalcutation() {
		if (simulation) {
			voltages[0] = 100;
			voltages[1] = 120;
			voltages[2] = 130;
			voltages[3] = 180;
			voltages[4] = 200;
			voltages[5] = 220;
			voltages[6] = 2;
			voltages[7] = 15;
			voltages[8] = 28;
			
			mag = voltages[voltageToShow];
			f = 55;

			ledStatus[0] = true;
			ledStatus[1] = true;
			ledStatus[2] = true;
			ledStatus[3] = false;
			ledStatus[4] = false;
			ledStatus[5] = false;
			ledStatus[6] = false;
			ledStatus[7] = false;
			ledStatus[8] = false;
			ledStatus[9] = false;

			workingHours += 0.1;
			hoursRunning = Math.floor(workingHours);
			hoursRunningDecimal = (workingHours * 10) % 10;

			temperature = 30;
			batteryVoltage = 11.8;
			oilPressure = 3;
		} else {
			voltages[0] = lightState.VA;
			voltages[1] = lightState.VB;
			voltages[2] = lightState.VC;
			voltages[3] = lightState.UAB;
			voltages[4] = lightState.UBC;
			voltages[5] = lightState.UCA;
			voltages[6] = lightState.IA;
			voltages[7] = lightState.IB;
			voltages[8] = lightState.IC;
			
			mag = voltages[voltageToShow];
			f = lightState.fA;

			ledStatus[0] = lightState.isMainPower;
			ledStatus[1] = lightState.isWorking;
			ledStatus[2] = lightState.isBatteryOk;
			ledStatus[3] = lightState.isBatteryLow;
			ledStatus[4] = lightState.isBatteryHigh;
			ledStatus[5] = lightState.isStartFail;
			ledStatus[6] = lightState.isHighTemp;
			ledStatus[7] = lightState.isLowOilPress;
			ledStatus[8] = lightState.isOverVoltage;
			ledStatus[9] = lightState.isOverSpeed;

			hoursRunning = Math.floor(lightState.workingHours);
			hoursRunningDecimal = (lightState.workingHours * 10) % 10;

			temperature = lightState.temperature;
			batteryVoltage = lightState.batteryLevel;
			oilPressure = lightState.oilPressure;
		}
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
			intermdiateCalcutation();

			console.log("gggggggetLightState");

		} catch (error) {
			console.error('Error:', error);
		}
		return;
	}

	onMount(()=> {
		if (simulation) {
			
		} else {
			socket.on<LightState>('led', (merterData) => {
				lightState = merterData;
				console.log("se pidio datos");
				console.log(lightState);
				// console.log(`${oilPressure} ${hoursRunning} ${hoursRunningDecimal}`);
				intermdiateCalcutation();
			});
			getLightstate();
		}
		intermdiateCalcutation();
		a_ancho = area.clientWidth;
		a_alto = area.clientHeight;
		// console.log(`Ancho: ${a_ancho}px, Alto: ${a_alto}px`);
		x0 = (a_ancho - ancho) / 2;
	});

	onDestroy(() => {
		if (!simulation) socket.off('led');
		console.log('destroyed');
	});

</script>



<!-- VoltMeter and frequencyMeter -->
<div class="container">
    <div class="instrument" bind:this={area} style="flex: 1;">
		<Voltmeter magnitude={mag} svgWidth={ancho} svgHeight={alto} x0={x0} varName={varName} units={units} needleColor={selected} maxScale={max}/>
    </div>
    <div class="instrument" style="flex: 1;">
        <Freqmeter magnitude={f} svgWidth={ancho} svgHeight={alto} units={["Hz", "RPM"]} minScale={45} maxScale={70} scaleLargeDivisions={5} scaleSmallDivisions={25} decimalPlaces={1} x0={x0} needleColor="gray"/>
    </div>
</div>

<!-- Variable selector -->
<div class="variable-selector" style="display: flex;">
	{#each colors as color, i}
		<button 
			aria-current={selected === color}
			style="background: {color}"
			on:click={() => {
								selected = color;
								voltageToShow = i;
								mag = voltages[voltageToShow];
								varName = variable[i];
								if (i < 6) {
									max = 300;
									units = "V"
								} else {
									max = 30;
									units = "A";
								}
							}
			}
		>{variable[i]}</button>
	{/each}
</div>

<!-- Leds indicator -->
<div class="status-led-panel">
	<StatusLedPanel ledStatus={ledStatus}/>
</div>

<!-- hour meter -->
<div class="hour-label">Horas de trabajo:</div>
<div class="hour-meter">
    <div style="display: flex; align-items: center;">
        <ODO value={hoursRunning} nrDigits={5} {dure} color="white" background="rgb(70, 70, 70)"/>
        <div class="decimal-point">.</div>
        <ODO value={hoursRunningDecimal} nrDigits={1} {dure} color="red" background="white"/>
    </div>
</div>

<!-- instruments -->
<div class="car-instruments">
    <div style="display: flex;">
		<CarThermometer temperature={temperature}/>
		<CarVoltmeter voltage={batteryVoltage}/>
		<CarOilPressuremeter oilPressure={oilPressure}/>
	</div>
</div>




<style>
	.test {
		color: rgb(44, 44, 44);
	}

	.container {
        display: flex;
        justify-content: center;
		margin-top: 15px;
    }

	.instrument {
		display: grid;
		grid-template-columns: repeat(7, 2fr);
		grid-gap: 5px;
		max-width: 800px;
	}

	.variable-selector {
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.variable-selector button {
		flex: 0;
		min-width: 32px;
		max-width: 50px;
		margin: 0 3px; /* Adjust margin as needed */
  	}

	button {
		aspect-ratio: 0.9;
		border-radius: 40%;
		background: var(--color, #9595f5);
		transform: translate(-2px,-2px);
		filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.2));
		transition: all 0.5s;
	}

	button[aria-current="true"] {
		transform: none;
		filter: none;
		color: white;
		font-weight: bold;
		box-shadow: inset 3px 3px 4px rgba(0,0,0,0.2);
	}

	button:not([aria-current="true"]) {
		color: gray;

	}

	.status-led-panel {
		margin-top: 40px;
	}

	.hour-label {
		margin-top: 30px;
		display: flex;
        align-items: center;
		justify-content: center;
    }
	.hour-meter {
		margin-top: 0px;
		display: flex;
        align-items: center;
		justify-content: center;
    }

	.decimal-point{
		margin: 0px -4px
	}

	.car-instruments {
		margin-top: 30px;
	}
	
</style>


