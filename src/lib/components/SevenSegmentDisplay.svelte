<script lang="ts">
	import Digit from '$lib/components/SevenSegmentDigit.svelte';

	export let count = 2;
	export let height = 250;
	export let value: String | null = null;
	export let color = 'red';
	export let backgroundColor: String = 'black';
	export let skew = false;

	let digits: string[] | null = null;
	let dotsArray: boolean[] = [];

	$: {
		let newDigits: string[] | null = value ? value.toString().split('') : null;
		let filteredDigits: string[] = [];

		dotsArray = [];
		if (value && count > value.toString().length) {
			for (let i = 0; i < count - value.toString().length; i++) {
				newDigits?.unshift('0');
			}
		}

		digits = newDigits;
		console.log('newDigits');
		console.log(newDigits);

		// Create filteredDigits and dotsArray
		if (newDigits) {
			for (let i = 0; i < newDigits.length - 1; i++) {
				if (newDigits[i] !== '.') {
					filteredDigits.push(newDigits[i]);
					dotsArray.push(newDigits[i + 1] === '.');
				}
			}
			if (newDigits[-1] !== '.') {
				dotsArray.push(false);
			}
		}

		console.log(digits);
		console.log(dotsArray);
	}
</script>

<div class="bg-{backgroundColor} flex">
	{#if digits}
		{#each digits as digit, index}
			<Digit dot={dotsArray[index]} char={digit} {height} {color} {skew} />
		{/each}
	{:else}
		{#each Array(count) as _, index}
			<Digit dot={dotsArray[index]} char="" {height} {color} {skew} />
		{/each}
	{/if}
</div>
