<script lang="ts">
	import { onMount } from 'svelte';
	import ApexCharts from 'apexcharts';

	export let data = [0];
	export let chartID: string;
	let chart: ApexCharts;

	$: {
		if (chart != undefined) {
			chart.updateOptions({
				series: [
					{
						data: data
					}
				]
			});
		}
	}
	var options = {
		chart: {
			type: 'line'
		},
		series: [
			{
				name: 'Power (W)',
				data: data,
				linewidth: 2
			}
		],
		stroke: {
			curve: 'smooth',
			width: 1
		},

		xaxis: {
			labels: {
				show: false
			}
		}
	};

	onMount(() => {
		chart = new ApexCharts(document.querySelector('#' + chartID), options);
		chart.render();
	});
</script>

<div id={chartID} class="w-full" />
