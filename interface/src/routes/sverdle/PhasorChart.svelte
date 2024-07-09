<script lang="ts">
	import { beforeUpdate } from 'svelte';

	export let Iabs = [1, 1, 1];
	export let Iang = [0, 0, 0];
	export let Icolor = ["red", "blue", "green"];
  export let showPhaseVoltages = true;
  export let showLineVoltages = true;
  export let phaseVoltages = [0, 0, 0];
  export let lineVoltages = [0, 0, 0];

  $: Imax = 1;
  $: maxScale = 2;
  $: lastAjust = 1;
  $: decimalUnits = 0;

  let arrowI = [1, 1, 1];
  
	let rs = [25, 50, 75, 100];
	let angs = [0, 30, 60, 120, 150, 180, 210, 240, 300, 330]
	let angL = [0, -30, -60, -120, -150, 180, 150, 120, 60, 30]
	
  beforeUpdate(() => {
    let order = -5;
    Imax = Iabs.reduce((p, c) => {return c > p ? c : p})
    while (10 ** order < Imax) order++;
    maxScale = 10 ** order;
    
    lastAjust = maxScale;
    if (Imax / maxScale < 0.6) lastAjust = 0.6 * maxScale;
    if (Imax / maxScale < 0.4) lastAjust = 0.4 * maxScale;
    if (Imax / maxScale < 0.2) lastAjust = 0.2 * maxScale;
    if (Imax / maxScale < 0.1) lastAjust = 0.1 * maxScale;
    maxScale = lastAjust;

    decimalUnits = 0;
    if (maxScale < 3) decimalUnits = 1;
    if (maxScale < .3) decimalUnits = 2;
    if (maxScale > 1 && (maxScale % 4) != 0) decimalUnits++;
    if (maxScale > 1 && (maxScale % 2) != 0) decimalUnits++;

    arrowI[0] = 10 * Iabs[0] / maxScale;
    if (Math.abs(arrowI[0]) > 1) arrowI[0] = Math.sign(arrowI[0]);
    arrowI[1] = 10 * Iabs[1] / maxScale;
    if (Math.abs(arrowI[1]) > 1) arrowI[1] = Math.sign(arrowI[1]);
    arrowI[2] = 10 * Iabs[2] / maxScale;
    if (Math.abs(arrowI[2]) > 1) arrowI[2] = Math.sign(arrowI[2]);
    
  });

</script>




<svg width="300" height="300" viewBox="-130 -130 260 260">
	
	<circle cx="0" cy="0" r="1" fill="gray" />
  
  <circle cx=0 cy=0 r=100 stroke=gray stroke-width=0.5 fill=transparent stroke-dasharray="3,2"/>

	{#each rs as  r, i}
    {#if i < 3}
		  <circle cx=0 cy=0 r={r} stroke=gray stroke-width=0.5 fill=transparent stroke-dasharray="4,6"/>
		{/if}
      <text x=0 y={-r}
			font-size = 10 
			dominant-baseline = "middle"
			text-anchor = "middle"
			fill="gray"
		>{((i+1) * maxScale / 4).toFixed(decimalUnits)}</text>
		<text x=0 y={r}
			font-size = 10 
			dominant-baseline = "middle"
			text-anchor = "middle"
			fill="gray"
		>{((i+1) * maxScale / 4).toFixed(decimalUnits)}</text>
	{/each}
	{#each angs as  a, i}
		<line x1=0 y1=0 x2=100 y2=0 stroke=gray	stroke-width=0.5 stroke-dasharray="4,6" transform="rotate({a})"/>
		<text x={110*Math.cos(a*Math.PI/180)} y={110*Math.sin(a*Math.PI/180)}
			font-size = 10 
			dominant-baseline = "middle"
			text-anchor = "middle"
			fill="gray"
		>{angL[i]}&deg</text>
	{/each}

  <text x={125*Math.cos(90*Math.PI/180)} y={125*Math.sin(90*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="red"
    transform="rotate(-90)"
  >Va = {phaseVoltages[0].toFixed(1)} V</text>

  <text x={125*Math.cos(120*Math.PI/180)} y={125*Math.sin(120*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="blue"
    transform="rotate(0)"
  >Vb = {phaseVoltages[1].toFixed(1)} V</text>
  <text x={125*Math.cos(-120*Math.PI/180)} y={125*Math.sin(-120*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="green"
    transform="rotate(0)"
  >Vb = {phaseVoltages[2].toFixed(1)} V</text>

  <text x={125*Math.cos(90*Math.PI/180)} y={125*Math.sin(90*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="purple"
    transform="rotate(-30)"
  >Vab = {lineVoltages[0].toFixed(1)} V</text>
  <text x={125*Math.cos(-90*Math.PI/180)} y={125*Math.sin(-90*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="purple"
    transform="rotate(-90)"
  >Vbc = {lineVoltages[1].toFixed(1)} V</text>
  <text x={125*Math.cos(-90*Math.PI/180)} y={125*Math.sin(-90*Math.PI/180)}
    font-size = 10 
    dominant-baseline = "middle"
    text-anchor = "middle"
    fill="purple"
    transform="rotate(30)"
  >Vca = {lineVoltages[2].toFixed(1)} V</text>

  
  {#each Iabs as  I, i}
		<line x1=0 y1=0 x2=100 y2=0 stroke={Icolor[i]}	stroke-width=2 stroke-dasharray="4,4" transform="rotate({i*120})"/>
		
    <path stroke-width=3 stroke={Icolor[i]} fill="transparent" transform="rotate({i*120 - Iang[i]})"
			d="M 0 0 L {100 * I / maxScale - 4} 0 l {-10*arrowI[i]} {3*arrowI[i]} l {10*arrowI[i]} {-3*arrowI[i]} l {-10*arrowI[i]} {-3*arrowI[i]}"		
			/>

    <path stroke-dasharray="2,1"
        d="M {125*Math.cos(-80*Math.PI/180)}  {125*Math.sin(-80*Math.PI/180)} 
          Q {127*Math.cos(-90*Math.PI/180)} {127*Math.sin(-90*Math.PI/180)} {125*Math.cos(-100*Math.PI/180)} {125*Math.sin(-100*Math.PI/180)}
          l 4 -4 m -4 4 l 5 3"
        stroke=gray
        stroke-width=0.5
        fill=transparent
        transform="rotate({i * 120})"
      />

    <path stroke-dasharray="2,1"
        d="M {125*Math.cos(-40*Math.PI/180)}  {125*Math.sin(-40*Math.PI/180)} 
          Q {127*Math.cos(-30*Math.PI/180)} {127*Math.sin(-30*Math.PI/180)} {125*Math.cos(-20*Math.PI/180)} {125*Math.sin(-20*Math.PI/180)}
          l 3 -5 m -3 5 l -5 -2"
        stroke=gray
        stroke-width=0.5
        fill=transparent
        transform="rotate({i * 120})"
      />

	{/each}

  <!-- <circle cx="0" cy="0" r="125" stroke=purple fill=transparent/>  -->

  <!-- <circle cx={125*Math.cos(-40*Math.PI/180)} cy={125*Math.sin(-40*Math.PI/180)} r="2" fill="red" />
	<circle cx={125*Math.cos(-20*Math.PI/180)} cy={125*Math.sin(-20*Math.PI/180)} r="2" fill="red" /> -->

	
</svg>
