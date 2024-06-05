<script lang="ts">

 const ss = {
        id: "Dot",
        clipPath: `circle(50% at 50% 50%)`,
        marginTop: 11.5,
        marginLeft: 7,
        transform: "none",
    }


    export let active;
    export let color;
    export let size;
    

    $:  outerStyle = `
        filter: ${active ? `drop-shadow(0px 0px ${size * 0.3}px ${color})` : "none"};
        padding: ${size * 0.3}px;
        width: fit-content;
        position: ${ss.id ? "absolute" : "relative"};
        transform: ${ss.transform};
        margin-top: ${size * ss.marginTop}px;
        margin-left: ${size * ss.marginLeft}px;
        z-index: 2;
    `;
    $: innerStyle = `
        background-color: ${color};
        filter: ${active ? "opacity(1) grayscale(0)" : "opacity(0.3) grayscale(0.7)"};
        color: ${color};
        clip-path: ${ss.clipPath};
        -webkit-clip-path: ${ss.clipPath};
        -moz-clip-path: ${ss.clipPath};
        height: ${size}px;
        width: ${size}px;
    `;
</script>

<style>
    /* Add any additional styles if needed */
</style>

<div style={outerStyle}>
    <div style={innerStyle}></div>
</div>
