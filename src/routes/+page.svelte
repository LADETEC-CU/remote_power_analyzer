<script lang="ts">
	import Clock from '$components/Clock.svelte';
	import CounterButton from '$components/CounterButton.svelte';
	/** @type {import('./$types').PageData} */
	import { PrismaClient } from '@prisma/client';
	export let data;
</script>

<svelte:head>
	<title>SvelteKit Template</title>

	<meta
		name="description"
		content="An opinionated SvelteKit template complete with Tailwind, PlayWright, Vitest, and Husky pre-installed"
	/>
</svelte:head>

<div class="container">
	<CounterButton />

	<Clock />

	<!-- {data?.measurement.sample.createdAt} -->
	<div class="flex">
		{#each data?.measurement.phases as phase}
			<table class="w-28 mx-2">
				<thead>
					<tr>
						<th colspan="2" class="px-4 bg-gray-200">Phase {phase.phase}</th>
					</tr>
					<tr>
						<th class="py-2 px-4 bg-gray-200">Parameter</th>
						<th class="py-2 px-4 bg-gray-200">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="py-2 px-4 border">Voltage</td>
						<td class="py-2 px-4 border">{phase.voltage}V</td>
					</tr>
					<tr>
						<td class="py-2 px-4 border">Current</td>
						<td class="py-2 px-4 border">{phase.current}A</td>
					</tr>
					<tr>
						<td class="py-2 px-4 border">Power</td>
						<td class="py-2 px-4 border">{phase.power}W</td>
					</tr>
					<tr>
						<td class="py-2 px-4 border">Power Reactive</td>
						<td class="py-2 px-4 border">{phase.power_r}VAR</td>
					</tr>
					<tr>
						<td class="py-2 px-4 border">Power Apparent</td>
						<td class="py-2 px-4 border">{phase.power_a}VA</td>
					</tr>
					<tr>
						<td class="py-2 px-4 border">Power Factor</td>
						<td class="py-2 px-4 border">{phase.power_factor}</td>
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
</style>
