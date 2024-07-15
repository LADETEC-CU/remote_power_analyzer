<script lang="ts">
	import { beforeUpdate } from 'svelte';

	export let P = 1;
  export let Q = 0;
  export let S = 1; //Math.sqrt(P ** 2 + Q ** 2);
  export let fp = 1; //Math.cos(Math.atan(Q/P));
  export let charWidth = 150;
  export let chartHeight = 240;
	// export let colorP = rgba(0, 255, 153, 0);
  // export let colorQ = rgba(255, 166, 0, 0);
  // export let colorS = rgba(0, 247, 251, 0);

  let Pr = P;
  let Qr = Q;
  let Sr = S;
  let maxScale = 2;
  let maxScaleA = 2;
  let gridMarks : number[] = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
  let decimalUnits = 0;
  let arrowP = 1;
  let arrowQ = 1;
  let arrowS = 1;
  let kilos : boolean;
  let megas : boolean;
  let unitsP = "W";
  let unitsQ = "VAr";
  let unitsS = "VA"
  let yLedgend = -60;
  let angRotateS = 0;

  function updateScales() {
    S = Math.sqrt(P ** 2 + Q ** 2);
    fp = Math.cos(Math.atan(Q/P));
    
    let maxPower = Math.abs(P);
    if (maxPower < Math.abs(Q)) maxPower = Math.abs(Q);
    let order = -5; 
    while (10 ** order < maxPower) order++;
    maxScaleA = 10 ** order;

    kilos = false;
    megas = false;
    Pr = P;
    Qr = Q;
    Sr = S;
    unitsP = "W";
    unitsQ = "VAr";
    unitsS = "VA";
    maxScale = maxScaleA;
    if (maxScaleA > 10000000) {
      megas = true;
      Pr = P / 1000000;
      Qr = Q / 1000000;
      Sr = S / 1000000;
      maxScale = maxScaleA /1000000;
      maxPower = maxPower / 1000000;
      unitsP = "MW";
      unitsQ = "MVAr";
      unitsS = "MVA";
    } else if (maxScaleA > 10000) {
      kilos = true;
      Pr = P / 1000;
      Qr = Q / 1000;
      Sr = S / 1000;
      maxScale = maxScaleA /1000;
      maxPower = maxPower / 1000;
      unitsP = "kW";
      unitsQ = "kVAr";
      unitsS = "kVA";
    }
    
    let lastAjust = maxScale;
    if (maxPower / maxScale < 0.5) lastAjust = 0.5 * maxScale;
    if (maxPower / maxScale < 0.25) lastAjust = 0.25 * maxScale;
    if (maxPower / maxScale < 0.2) lastAjust = 0.2 * maxScale;
    if (maxPower / maxScale < 0.1) lastAjust = 0.1 * maxScale;
    maxScale = lastAjust;

    gridMarks = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
    for (let i = -4; i < 5; i++) {
      gridMarks[i+4] = 100 * i/4;
    }
    
    decimalUnits = 0;
    if (maxScale <= 10) decimalUnits = 1;
    if (maxScale < 1) decimalUnits = 2;
    // if (maxScale > 1 && (maxScale % 4) != 0) decimalUnits++;
    // if (maxScale > 1 && (maxScale % 2) != 0) decimalUnits++;

    if (Qr / maxScale > 0.1) {
        yLedgend = 60;
    } 
    if (Qr / maxScale < -0.1) {
        yLedgend = -60;
    } 
    
    arrowP = 7 * Pr / maxScale;
    if (Math.abs(arrowP) > 0.7) arrowP = Math.sign(arrowP) * 0.7;
    arrowQ = 7 * Qr / maxScale;
    if (Math.abs(arrowQ) > 0.7) arrowQ = Math.sign(arrowQ) * 0.7;
    arrowS = 7 * Sr / maxScale;
    if (Math.abs(arrowS) > 0.7) arrowS = Math.sign(arrowS) * 0.7;

    if (Pr != 0) angRotateS = -Math.atan(Qr/Pr) * 180 / Math.PI;
    else angRotateS = - Math.sign(Qr) * 90;
    
    // console.log(`${Qr.toFixed(2)} ${(arrowQ).toFixed(2)} ${maxPower} ${maxScale}`);

  }
  
  beforeUpdate(() => {
    updateScales(); 
  });

  updateScales(); 

</script>

<svg width={charWidth} height={chartHeight} viewBox="-25 -120 150 240">
	  
	<!-- <rect x=-25 y=-120 width=150 height=240 stroke=gray fill=white/> -->
	
  <path class="axes"
			d="M 0 110 L 0 -116 l -3 10 m 3 -10 l 3 10
         M -2 0 L 120 0 l -10 -3 m 10 3 l -10 3"		
			/>

      {#each gridMarks as  r, i}
        <line class="grid" x1=1 y1={r} x2= 100 y2={r} stroke-dasharray="4,6"></line>
        {#if i > 4}
        <line class="grid" x1={r} y1=-100 x2={r} y2=100 stroke-dasharray="4,6"></line>
          <text class="grid-label" x={r} y={9}
            font-size = 7.5 
            dominant-baseline = "end"
            text-anchor = "middle"
            >{((i-4)*maxScale/4).toFixed(decimalUnits)}</text>
        {/if}
        <text class="grid-label" x={-2} y={r}
          font-size = 7.5 
          dominant-baseline = "middle"
          text-anchor = "end"
          >{-((i-4)*maxScale/4).toFixed(decimalUnits)}</text>
      {/each}
  
    <text class="grid-label" x=112 y={-7}
			font-size = 9 
			dominant-baseline = "middle"
			text-anchor = "middle"
		>{unitsP}</text>
    <text class="grid-label" x=5 y={-110}
			font-size = 9 
			dominant-baseline = "middle"
			text-anchor = "start"
		>{unitsQ}</text>
    
    
    <path class="Q" stroke-width = {Math.abs(2*arrowQ/0.7)}
			d="M 0 0 L {100 * Qr / maxScale - 4*arrowQ} 0 l {-10*arrowQ} {3*arrowQ} l {10*arrowQ} {-3*arrowQ} l {-10*arrowQ} {-3*arrowQ}"
      transform="rotate(-90) translate(0,{100 * Pr / maxScale})"
			/>

    <path class="S" stroke-width = {Math.abs(2*arrowS/0.7)}
			d="M 0 0 L {100 * Sr / maxScale - 4*arrowS} 0 l {-10*arrowS} {3*arrowS} l {10*arrowS} {-3*arrowS} l {-10*arrowS} {-3*arrowS}"
      transform="rotate({angRotateS})"
			/>

    <path class="P" stroke-width = {Math.abs(2*arrowP/0.7)}
			d="M 0 0 L {100 * Pr / maxScale - 4*arrowP} 0 l {-10*arrowP} {3*arrowP} l {10*arrowP} {-3*arrowP} l {-10*arrowP} {-3*arrowP}"		
			/>

    <text class="P-label" x=10 y={yLedgend - 25}
      font-size = 13 
      dominant-baseline = "middle"
      text-anchor = "start"
      stroke-width= 1
    >P:</text>
    <text class="P-label" x=72 y={yLedgend - 25}
			font-size = 13 
			dominant-baseline = "middle"
			text-anchor = "end"
      stroke-width= 1
		>{Pr.toFixed(1)}</text>
    <text class="P-label" x=77 y={yLedgend - 25}
			font-size = 13 
			dominant-baseline = "middle"
			text-anchor = "start"
      stroke-width= 1
		>{unitsP}</text>
    
    <text class="Q-label" x=10 y={yLedgend}
      font-size = 13 
      dominant-baseline = "middle"
      text-anchor = "start"
      stroke-width= 1
    >Q:</text>
    <text class="Q-label" x=72 y={yLedgend}
			font-size = 13 
      dominant-baseline = "middle"
			text-anchor = "end"
      stroke-width= 1
		>{Qr.toFixed(1)}</text>
    <text class="Q-label" x=77 y={yLedgend}
      font-size = 13 
      dominant-baseline = "middle"
      text-anchor = "start"
      stroke-width= 1
    >{unitsQ}</text>

    <text class="S-label" x=10 y={yLedgend + 25}
      font-size = 13 
      dominant-baseline = "middle"
      text-anchor = "start"
      stroke-width= 1
    >S:</text>
    <text class="S-label" x=72 y={yLedgend + 25}
			font-size = 13 
			dominant-baseline = "middle"
			text-anchor = "end"
      stroke-width= 1
		>{Sr.toFixed(1)}</text>
    <text class="S-label" x=77 y={yLedgend + 25}
			font-size = 13 
			dominant-baseline = "middle"
			text-anchor = "start"
      stroke-width= 1
		>{unitsS}</text>
    
    <text class="fp-label" x=6 y=110
      font-size = 13 
      dominant-baseline = "middle"
      text-anchor = "start"
      stroke-width = 1
      font-weight = "normal"
    >fp: {fp.toFixed(2)}, &#x3c6: {(Math.sign(Qr)*(Math.acos(fp)*180/Math.PI)).toFixed(1)}&deg</text>
    
  
  <!-- <circle cx=0 cy=0 r=3 fill=red /> -->

</svg>

<style>
  .axes {
    stroke: gray;
    fill: transparent;
  }

  .grid {
    stroke: gray;
    stroke-width: 0.3;
    fill: transparent;
  }

  .grid-label, .fp-label {
    fill: rgb(67, 67, 67);
    font-weight: normal
  }

  .P {
    stroke: rgb(0, 103, 89);
    fill: transparent;
    font-weight: normal
  }

  .Q {
    stroke: rgb(255, 145, 0);
    fill: transparent;
    font-weight: normal
  }

  .S {
    stroke: rgb(155, 0, 251);
    fill: transparent;
    font-weight: normal
  }

  .P-label {
    fill: rgb(0, 103, 89);
    font-weight: normal
  }

  .Q-label {
    fill: rgb(255, 145, 0);
    font-weight: normal
  }

  .S-label {
    fill: rgb(155, 0, 251);
    font-weight: normal
  }

</style>