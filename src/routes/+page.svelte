<script lang="ts">
	import { onMount } from 'svelte';
	import '@carbon/charts-svelte/styles.css';
	import Number from '$components/Number.svelte';
	import Clock from '$components/Clock.svelte';
	import Ampmeter from '$components/Ampmeter.svelte';
	import Chart from '$components/Chart.svelte';

	import {
		Tabs,
		TabItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	/** @type {import('./$types').PageData} */
	import { invalidate } from '$app/navigation';

	export let data;

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

<Clock />
<Tabs tabStype="full">
	{#each data?.measurement.phases as phase, i}
		<TabItem open={i < 1}>
			<span slot="title">Phase {phase.phase}</span>
			<div class="md:flex">
				<div>
					<Ampmeter current={phase.current} canvasId={`I${phase.phase}_gauge`} />
				</div>
				<div class="md:w-3/4">
					<Chart
						data={data?.measurement.powerHistory[phase.phase]}
						chartID={`chart_${phase.phase}`}
					/>
				</div>
			</div>
			<Table>
				<TableHead>
					<TableHeadCell>Parameter</TableHeadCell>
					<TableHeadCell>Value</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y">
					<TableBodyRow>
						<TableBodyCell>Voltage</TableBodyCell>
						<TableBodyCell><Number number={phase.voltage} />V</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Current</TableBodyCell>
						<TableBodyCell><Number number={phase.current} />A</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Power</TableBodyCell>
						<TableBodyCell><Number number={phase.power} />W</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Power Reactive</TableBodyCell>
						<TableBodyCell><Number number={phase.power_r} />VAR</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Power Apparent</TableBodyCell>
						<TableBodyCell><Number number={phase.power_a} />VA</TableBodyCell>
					</TableBodyRow>
					<TableBodyRow>
						<TableBodyCell>Power Factor</TableBodyCell>
						<TableBodyCell><Number number={phase.power_factor} /></TableBodyCell>
					</TableBodyRow>
				</TableBody>
			</Table>
		</TabItem>
	{/each}
</Tabs>

<style lang="postcss">
</style>
