<script>

	import { beforeUpdate } from 'svelte';
	import { spring } from 'svelte/motion';

    export let voltage = 9.7;

	if (voltage < 9.7)
		voltage = 9.7;
    if (voltage > 16.3)
		voltage = 16.3;

	let angle1 = (90 - 14*(voltage - 13)) * Math.PI / 180;

    $: angle = (90 - 14*(voltage - 13)) * Math.PI / 180;

	$: x2 = 75 * Math.cos(angle);
  	$: y2 = 50 - 75 * Math.sin(angle);
  
	$: coords1 = spring({ x: 75 * Math.cos(angle1), y: 50 - 75 * Math.sin(angle1) }, {
		stiffness: 0.08,
		damping: 0.28
	});

	beforeUpdate(() => {
		coords1.set({x:x2, y:y2});
	})

</script>

<svg width="200" height="100" viewBox="-100 -100 200 200">
    <defs>
        <radialGradient id="RadialGradient">
            <stop offset="86%" stop-color="black" />
            <stop offset="92%" stop-color="white" />
            <stop offset="100%" stop-color="black" />
            
        </radialGradient>

        <clipPath id="cut-needle">
            <path class="scale-background"
                d="
                    M -40, 20
                    L  40, 20
                    Q  46.5 20 50 15
                    L  68 -20
                    Q  70 -24 68 -27
                    Q   0 -113 -68 -27
                    Q  -70 -24 -68 -20
                    L  -50 15
                    Q  -46.5 20 -40 20 
                    "
            />
        </clipPath>
    </defs>
    <circle cx="0" cy="0" r="100" fill="url(#RadialGradient)"/>
    
    <circle class="instrument-background" cx="0" cy="0" r="85" />
	
    <path class="scale-background"
		d="
			M -40, 20
			L  40, 20
			Q  46.5 20 50 15
			L  68 -20
			Q  70 -24 68 -27
			Q   0 -108 -68 -27
			Q  -70 -24 -68 -20
			L  -50 15
			Q  -46.5 20 -40 20 
			"
			stroke-width="1"
  	/>

	<path class="icon"
		d="
			M -17 42
			L  17 42
			L  17 62
			L -17 62
			Z
			M -14 42
			L -14 39
			L  -9 39
			L  -9 42
			M  14 42
			L  14 39
			L   9 39
			L   9 42
			"
			stroke-width="3"
  	/>

	<path class="icon"
	  d="
		  M -13 48
		  L  -7 48
		  M  13 48
		  L   7 48
		  L  10 48
		  L  10 45
		  L  10 51
		  "
		  stroke-width="1"
	/>

	<path class="scale-foreground"
	  d="
		  M  -52 -9  
		  L  -44   0 
		  Q    0 -35 44 0
		  L   52 -9
		  "
		  stroke-width="3"
	/>

	<path class="scale-right-mark"
	  d="
		  M  34 -7.1
		  Q  31 -10 44 0
		  L  52 -9
		  "
		  stroke-width="3"
	/>

	<path class="scale-central-mark"
	  d="
		  M  -5 -17.2
		  Q  14 -19 33 -7.7
		  M  16 -15.2
		  L  18 -22
		  "
		  stroke-width="3"
	/>

	<text class="units" x="0" y="6" 
		font-size = 20
		
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
	>V</text>

    <text class="units" x="-34" y="-47" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(-35)"
	>10</text>

    <text class="units" x="11" y="-38" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(14)"
	>13</text>

    <text class="units" x="33" y="-47" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(35)"
	>16</text>


    <line class="needle" 
        x1= 0 
        y1= 50 
        x2= {$coords1.x} 
        y2= {$coords1.y}
        stroke-width="6" 
        stroke-linecap="round"
        clip-path="url(#cut-needle)"
    >
    </line>

    <!-- <circle class="needle" cx="0" cy="50" r="78"/> -->

    <!-- <circle cx="25" cy="-11.6" r="2" fill="red" />
	<circle cx="-5" cy="-17.2" r="2" fill="red" /> -->

</svg>

<style>
    .instrument-background {
        fill: #4b4c6b
    }

    .scale-background {
        fill: #0b1c39
    }

    .scale-foreground {
        stroke: #ff8000;
        fill: transparent
    }

    .scale-central-mark {
        stroke: #ecf8d7;
    }

	.scale-right-mark {
        stroke: red;
		fill:transparent
    }

    .units {
        fill: #c6f4fa;
    }

    .icon {
        stroke: #ccf587;
        fill: transparent
    }

    .needle {
        stroke: #ff9f2a;
        fill: transparent;
    }
</style>