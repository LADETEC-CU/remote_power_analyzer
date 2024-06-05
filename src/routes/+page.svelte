<script>
  import SevenSegmentDisplay from '$lib/components/SevenSegmentDisplay.svelte';

  let voltage = "1234";
</script>

<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>

<main class="flex items-center justify-center h-screen">
    <input type=text bind:value={voltage} />
  <SevenSegmentDisplay value={voltage} height={40} count={4}/>
</main>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>