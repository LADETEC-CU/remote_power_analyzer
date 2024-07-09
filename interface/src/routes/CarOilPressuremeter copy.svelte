<script>

	import { beforeUpdate } from 'svelte';
	import { spring } from 'svelte/motion';

    export let oilPressure = -0.3;
	
	if (oilPressure < -0.3)
		oilPressure = -0.3;
    if (oilPressure > 6.3)
		oilPressure = 6.3;

	let angle1 = (90 - 13.9*(oilPressure - 3)) * Math.PI / 180;;
	
	$: angle = (90 - 13.9*(oilPressure - 3)) * Math.PI / 180;

	$: x2 = 75 * Math.cos(angle);
  	$: y2 = 50 - 75 * Math.sin(angle);
  
	$: coords1 = spring({ x: 75 * Math.cos(angle1), y: 50 - 75 * Math.sin(angle1) }, {
		stiffness: 0.08,
		damping: 0.28
	});

	beforeUpdate(() => {
		coords1.set({x:x2, y:y2});
	});
	
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
			M -15 50
			L  2 50
			L  5 53
			L  18 48
			L  21 51
			M  14 50
			L  5  60
			L -15 60
			L -15 45
			L -22 43
			L -23 47
			L -11 50
			M -5 50
			L -5 44
			L  0 44
			L -10 44
			"
			stroke-width="3"
  	/>

	<path class="icon-drop"
	  d="
		  M 21 54
		  L 22 58
		  Q 21 61 20 58
		  L 21 55
		  "
		  stroke-width="1"
	/>

	<path class="scale-foreground"
	  d="
		  M  -52 -9  
		  L  -44   0 
		  Q    0 -35 44 0
		  L   52 -9
		  M   16.8 -15.8
		  L   18.5 -25
		  "
		  stroke-width="3"
	/>

	<circle class="scale-foreground" cx="35" cy="-16" r="1" stroke-width="2" />

	<text class="units" x="0" y="6" 
		font-size = 16	
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
	>kg/cm&sup2</text>

    <text class="units" x="-34" y="-47" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(-35)"
	>0</text>

    <text class="units" x="11" y="-38" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(14)"
	>4</text>

    <text class="units" x="34" y="-48" 
		font-size = 12
		dominant-baseline = "middle"
		text-anchor = "middle"
		font-weight = "bold"
		fill="white"
        transform = "rotate(39)"
	>6</text>


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
        stroke: #ccf587;
        fill: transparent
    }

    .units {
        fill: #c6f4fa;
    }

    .icon {
        stroke: #ccf587;
        fill: transparent
    }

	.icon-drop {
        stroke: #ccf587;
        fill: #ccf587
    }

    .needle {
        stroke: #ff9f2a;
        fill: transparent;
    }
</style>