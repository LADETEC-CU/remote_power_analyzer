<script lang="ts">
	import { onMount } from 'svelte';
	import '@carbon/charts-svelte/styles.css';
	import Number from '$components/Number.svelte';
	import Clock from '$components/Clock.svelte';
	import Ampmeter from '$lib/components/Ampmeter.svelte';
	/** @type {import('./$types').PageData} */
	import { invalidate } from '$app/navigation';

	export let data;
	let i1 = 0;

	$: i1 = data?.measurement.phases[0].current;

	onMount(() => {
		const interval = setInterval(() => {
			invalidate('app:sample');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>SvelteKit Template</title>

	<meta
		name="description"
		content="An opinionated SvelteKit template complete with Tailwind, PlayWright, Vitest, and Husky pre-installed"
	/>
</svelte:head>

<div class="container">
	<Clock />
	<div class="flex gauges">
		<Ampmeter current={i1} canvasId="I1_gauge" />
	</div>

	<!-- {data?.measurement.sample.createdAt} -->
	<div class="flex">
		{#each data?.measurement.phases as phase}
			<table>
				<thead>
					<tr>
						<th colspan="2">Phase {phase.phase}</th>
					</tr>
					<tr>
						<th>Parameter</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Voltage</td>
						<td><Number number={phase.voltage} />V</td>
					</tr>
					<tr>
						<td>Current</td>
						<td><Number number={phase.current} />A</td>
					</tr>
					<tr>
						<td>Power</td>
						<td><Number number={phase.power} />W</td>
					</tr>
					<tr>
						<td>Power Reactive</td>
						<td><Number number={phase.power_r} />VAR</td>
					</tr>
					<tr>
						<td>Power Apparent</td>
						<td><Number number={phase.power_a} />VA</td>
					</tr>
					<tr>
						<td>Power Factor</td>
						<td><Number number={phase.power_factor} /></td>
					</tr>
				</tbody>
			</table>
		{/each}
	</div>
</div>

<style lang="postcss">
	div.container {
		@apply flex flex-col justify-around items-center;
		@apply dark:bg-gray-900 dark:text-white;
		@apply leading-loose h-screen pb-24;
	}

	#sveltekit {
		@apply cursor-pointer;
		@apply from-[#FE5858] via-[#FC9842] to-[#eb9927];
	}

	#tailwind {
		@apply cursor-pointer;
		@apply from-green-400 via-blue-500 to-indigo-500;
	}
	table {
		@apply mx-2;
	}
	td {
		@apply py-2 px-4 border;
	}
	th {
		@apply py-2 px-4 bg-gray-200;
	}
</style>
