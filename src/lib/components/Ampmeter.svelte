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
			title: false,
			value: current,
			minValue: 0,
			maxValue: 30,
			majorTicks: ['0', '5', '10', '15', '20', '30'],
			minorTicks: 5,
			strokeTicks: false,
			highlights: [
				{ from: 0, to: 20, color: 'green' },
				{ from: 20, to: 30, color: 'red' }
			],
			colorPlate: '#222',
			colorMajorTicks: '#f5f5f5',
			colorMinorTicks: '#ddd',
			colorTitle: '#fff',
			colorUnits: '#ccc',
			colorNumbers: '#eee',
			colorNeedle: 'rgba(240, 128, 128, 1)',
			colorNeedleEnd: 'rgba(255, 160, 122, .9)',
			valueBox: true,
			animationRule: 'bounce',
			animationDuration: 500
		});
		radial.draw();
	});
</script>

<canvas id={canvasId} />
