<script lang="ts">
    import Segment from "./SevenSegmentSegment.svelte";
    import Dot from "./SevenSegmentDot.svelte";

    export let char = "";
    export let color = "red";
    export let height = 250;
    export let skew = false;
    export let dot = false;

    const charToDigit: { [key: string]: number[] } = {
    "0": [1, 1, 1, 1, 1, 1, 0],
    "1": [0, 1, 1, 0, 0, 0, 0],
    "2": [1, 1, 0, 1, 1, 0, 1],
    "3": [1, 1, 1, 1, 0, 0, 1],
    "4": [0, 1, 1, 0, 0, 1, 1],
    "5": [1, 0, 1, 1, 0, 1, 1],
    "6": [1, 0, 1, 1, 1, 1, 1],
    "7": [1, 1, 1, 0, 0, 0, 0],
    "8": [1, 1, 1, 1, 1, 1, 1],
    "9": [1, 1, 1, 1, 0, 1, 1],
    "@": [1, 1, 1, 1, 1, 0, 1],
    "a": [1, 1, 1, 0, 1, 1, 1],
    "b": [0, 0, 1, 1, 1, 1, 1],
    "c": [1, 0, 0, 1, 1, 1, 0],
    "d": [0, 1, 1, 1, 1, 0, 1],
    "e": [1, 0, 0, 1, 1, 1, 1],
    "f": [1, 0, 0, 0, 1, 1, 1],
    "-": [0, 0, 0, 0, 0, 0, 1],
    "": [0, 0, 0, 0, 0, 0, 0],
}

    const letters = ["A", "B", "C", "D", "E", "F", "G"];
    let activeArray = char ? charToDigit[char] : charToDigit[""];

    $: activeArray = char ? charToDigit[char] : charToDigit[""];

    let style = `
        height: ${height}px;
        width: ${height * 0.6}px;
        z-index: 1;
        padding: ${skew ? '8px 0px' : '0'};
        box-sizing: border-box;
    `;
</script>

<style>
    .digit {
        /* styles here if needed */
    }
</style>

<div class="digit" style={style}>
    {#each activeArray as active, index}
        <Segment
            active={active === 1}
            size={height / 12.5}
            color={color}
            id={letters[index]}
            skew={skew}
        />
        {#if dot}
        <Dot
            active={active === 1}
            size={height / 12.5}
            color={color}
        />
            
        {/if}
    {/each}
</div>
