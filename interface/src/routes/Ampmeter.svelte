
<script lang="ts">
	import { onMount } from 'svelte';
	import { RadialGauge } from 'canvas-gauges';

	export let current = 0;
	export let canvasId: string;

	let radial: RadialGauge;

	$: {
		if (radial != undefined) {
			radial.value = current;
		}
	}

	onMount(() => {
		radial = new RadialGauge({
			renderTo: canvasId,
			width: 200,
			height: 200,
			units: 'A',
			title: 'Corriente',
			value: current,
			minValue: 0,
			maxValue: 30,
			majorTicks: ['0', '5', '10', '15', '20', '30'],
			minorTicks: 5,
			strokeTicks: false,
			highlights: [
				{ from: 0, to: 10, color: '#dddddd' },
				{ from: 10, to: 20, color: '#E1EFFE' },
				{ from: 20, to: 30, color: '#1A56DB' }
			],
			colorPlate: '#dddddd',
			colorMajorTicks: '#080808',
			colorMinorTicks: '#333',
			colorTitle: '#1C64F2',
			colorUnits: '#222',
			colorNumbers: '#222',
			colorNeedle: '#233876',
			colorNeedleEnd: '#1C64F2',
			colorValueText: '#1C64F2',
			colorValueBoxBackground: 'white',
			valueBox: true,
			animationRule: 'bounce',
			animationDuration: 500
		});
		radial.draw();
	});
</script>

<canvas id={canvasId} />