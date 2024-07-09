<script>

	import { beforeUpdate } from 'svelte';
	import { spring } from 'svelte/motion';

    export let temperature = 80;
	let temperatureNeedle = 80;
	
	$: {
		temperatureNeedle = temperature;
		if (temperatureNeedle < 43)
			temperatureNeedle = 43;
		else if (temperatureNeedle > 127)
			temperatureNeedle = 127;
	}

    let angle1 = (90 - 1.18*(temperatureNeedle - 85)) * Math.PI / 180;
	
	$: angle = (90 - 1.18*(temperatureNeedle - 85)) * Math.PI / 180;;

	$: x2 = 80 * Math.cos(angle);
	$: y2 = 50 - 60 * Math.sin(angle);

	$: coords1 = spring({ x: 80 * Math.cos(angle1), y: 50 - 60 * Math.sin(angle1) }, {
		stiffness: 0.08,
		damping: 0.28
	});

	beforeUpdate(() => {
		coords1.set({x:x2, y:y2});
	});

</script>

<svg width="200" height="110" viewBox="-100 -100 200 200">
    <defs>
        <radialGradient id="RadialGradient">
            <stop offset="86%" stop-color="black" />
            <stop offset="92%" stop-color="white" />
            <stop offset="100%" stop-color="black" />
            
        </radialGradient>

        <clipPath id="cut-needle-temp">
            <path 
                d="
                    M -45, 25
					L  45, 25
					Q  51.5 25 55 20
					L  68 -5
					Q  70 -9 68 -12
					Q   0 -68 -68 -12
					Q  -70 -9 -68 -5
					L  -55 20
					Q  -51.5 25 -45 25 
					"
					fill="red"
					stroke="red"
			/>
        </clipPath>
    </defs>
    <circle cx="0" cy="0" r="100" fill="url(#RadialGradient)"/>
    
    <circle class="instrument-background" cx="0" cy="0" r="85" />
		
    <path class="scale-background"
		d="
			M -45, 25
			L  45, 25
			Q  51.5 25 55 20
			L  68 -5
			Q  70 -9 68 -12
			Q   0 -68 -68 -12
			Q  -70 -9 -68 -5
			L  -55 20
			Q  -51.5 25 -45 25 
			"
			stroke-width="1"
  	/>

	<path class="icon"
		d="
			M -17 62
			Q -12 57  -9 60
			Q  -6 64  -3 60
			Q   0 57   3 60
			Q   6 64   9 60
			Q  12 57  17 62
			"
			stroke-width="3"

  	/>

	<rect class="instrument-background" x="-6" y="55" width="12" height="10"/>

	<path class="icon"
		d="
			M -15 70
			Q -12 74  -9 70
			Q  -6 67  -3 70
			Q   0 74   3 70
			Q   6 67   9 70
			Q  12 74  15 70
			"
			stroke-width="3"
  	/>

	  <path class="icon"
	  d="
		  M  0, 36
		  L  0, 59
		  L  0, 39
		  L  8, 39
		  L  0, 39
		  L  0, 45
		  L  8, 45
		  L  0, 45
		  L  0, 51
		  L  8, 51
		  L  0, 51
		  "
		  stroke-width="3"
		  stroke-linecap="round"
	/>
	<circle class="icon" cx="0" cy="60" r="2" stroke-width="4"/>

	<path class="scale-foreground"
	  d="
		  M  -52 6  
		  L  -44   15 
		  Q    0 -20 44 15
		  L   52 6
		  "
		  stroke="white"
		  stroke-width="3"
	/>

	<path class="scale-foreground-mark"
	  d="
		  M  -10 -2
		  L  -10.5 -9
		  L  -4 -9
		  L   -4  -6
		  L   12  -6
		  L   12  -3
		  Q   0 -5 -10 -2
		  M   20 1
		  L   22 -5
		  "
		  stroke-width="3"
	/>

	<text class="units" x="0" y="-58" 
		font-size = 20
		
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
	>{temperature.toFixed(1)}</text>

	<text class="units" x="0" y="14" 
		font-size = 16	
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
	>&degC</text>

	<text class="units" x="-44" y="-37" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(-35)"
	>50</text>

    <text class="units" x="-10" y="-26" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(-4)"
	>80</text>

	<text class="units" x="16" y="-30" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(19)"
	>100</text>

    <text class="units" x="43" y="-37" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(35)"
	>120</text>


    <line class="needle" 
		x1= 0 
		y1= 65 
		x2= {$coords1.x} 
		y2= {$coords1.y}
		stroke-width="6" 
        stroke-linecap="round"
        clip-path="url(#cut-needle-temp)"
    >
    </line>

    <!-- <circle class="needle" cx="0" cy="50" r="78"/> -->

    <!-- <circle cx="30" cy="100" r="2" fill="red" />
	<circle cx="45" cy="100" r="2" fill="red" /> -->

</svg>

<style>
    .instrument-background {
        fill: #4b4c6b
    }

    .scale-background {
        fill: #0b1c39
    }

    .scale-foreground {
        stroke: #ccf587;
        fill: transparent
    }

    .scale-foreground-mark {
        stroke: #ccf587;
        fill: #ccf587;
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