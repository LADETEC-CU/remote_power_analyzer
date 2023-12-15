<script lang="ts">
	import { onMount } from 'svelte';
	import '@carbon/charts-svelte/styles.css';
	import Number from '$components/Number.svelte';
	import Clock from '$components/Clock.svelte';
	import Ampmeter from '$components/Ampmeter.svelte';
	import Chart from '$components/Chart.svelte';
	import { base } from '$app/paths';
	import {
		Tabs,
		TabItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toggle
	} from 'flowbite-svelte';
	/** @type {import('./$types').PageData} */
	import { invalidate } from '$app/navigation';
	import { source } from 'sveltekit-sse';
	const value = source('api/sensor');

	export let data;

	function toggle_changed(evt) {
		const url = `${base}/api/digital_output/${evt.target.dataset.id}/${evt.target.checked}`;
		fetch(url).catch((error) => {
			console.log(error);
			return [];
		});
		invalidate('app:sample'); // refresh interfase
	}

	// onMount(() => {
	// 	const interval = setInterval(() => {
	// 		invalidate('app:sample');
	// 	}, 1000);

	// 	return () => clearInterval(interval);
	// });
</script>

<svelte:head>
	<title>Control Remoto</title>

	<meta
		name="description"
		content="Un sistema para la supervición de remota del consumo de energía. Incluye el encendido y apagado de cargas eléctricas."
	/>
</svelte:head>
{$value}
<Clock />
<div class="md:flex justify-center sm:px-8 md:p-0">
	{#each data?.measurement.digital_outputs as output}
		<Toggle class="p-4" checked={output.value} on:change={toggle_changed} data-id={output.id}
			>{output.name}</Toggle
		>
	{/each}
</div>

<Tabs tabStype="full">
	{#each data?.measurement.phases as phase, i}
		<TabItem open={i === 1}>
			<span slot="title">Fase {phase.phase}</span>
			<div class="md:grid md:grid-cols-4">
				<div class="lg:col-span-2 md:col-span-4">
					<Chart
						data={data?.measurement.powerHistory[phase.phase]}
						chartID={`chart_${phase.phase}`}
					/>
				</div>
				<div class="lg:col-span-1 md:col-span-2">
					<Ampmeter current={phase.current} canvasId={`I${phase.phase}_gauge`} />
				</div>
				<div class="lg:col-span-1 md:col-span-2">
					<Table>
						<TableHead>
							<TableHeadCell>Parámetro</TableHeadCell>
							<TableHeadCell>Valor</TableHeadCell>
						</TableHead>
						<TableBody class="divide-y">
							<TableBodyRow>
								<TableBodyCell>Voltaje</TableBodyCell>
								<TableBodyCell><Number number={phase.voltage} />V</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>Corriente</TableBodyCell>
								<TableBodyCell><Number number={phase.current} />A</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>Potencia</TableBodyCell>
								<TableBodyCell><Number number={phase.power} />W</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>Potencia Ractiva</TableBodyCell>
								<TableBodyCell><Number number={phase.power_r} />VAR</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>Potencia Aparente</TableBodyCell>
								<TableBodyCell><Number number={phase.power_a} />VA</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell>Factor de Potencia</TableBodyCell>
								<TableBodyCell><Number number={phase.power_factor} /></TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				</div>
			</div>
		</TabItem>
	{/each}
</Tabs>

<style lang="postcss">
</style>
