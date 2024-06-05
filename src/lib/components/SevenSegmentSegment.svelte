<script lang="ts">
     type SegmentStyleType = {
    id: string;
    clipPath: string;
    marginTop: number;
    marginLeft: number;
    transform: string;
};

 const segmentStyle = {
    "A": {
        id: "A",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 0,
        marginLeft: 0.9,
        transform: "none",
    },
    "B": {
        id: "B",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 2.65,
        marginLeft: 3.55,
        transform: "rotate(90deg)",
    },
    "C": {
        id: "C",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 7.95,
        marginLeft: 3.55,
        transform: "rotate(90deg)",
    },
    "D": {
        id: "D",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 10.6,
        marginLeft: 0.9,
        transform: "none",
    },
    "E": {
        id: "E",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 7.95,
        marginLeft: -1.75,
        transform: "rotate(90deg)",
    },
    "F": {
        id: "F",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 2.65,
        marginLeft: -1.75,
        transform: "rotate(90deg)",
    },
    "G": {
        id: "G",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 10% 100%, 0 50%, 10% 0)`,
        marginTop: 5.3,
        marginLeft: 0.9,
        transform: "none",
    }
};

 const skewedSegmentStyle = {
    "A": {
        id: "A",
        clipPath: `polygon(92.5% 0%, 100% 30%, 85.5% 100%, 15.5% 100%, 0px 30%, 5.5% 0%)`,
        marginTop: 0,
        marginLeft: 1.575,
        transform: "none",
    },
    "B": {
        id: "B",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 15.5% 100%, 0px 30%, 5.5% 0%)`,
        marginTop: 2.4,
        marginLeft: 3.8,
        transform: "rotate(95deg)",
    },
    "C": {
        id: "C",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 7% 100%, 0px 73%, 11.5% 0%)`,
        marginTop: 7.625,
        marginLeft: 3.375,
        transform: "rotate(95deg) scaleX(-1) scaleY(-1)",
    },
    "D": {
        id: "D",
        clipPath: `polygon(92.5% 0%, 100% 30%, 85.5% 100%, 15.5% 100%, 0px 30%, 5.5% 0%)`,
        marginTop: 10.075,
        marginLeft: 0.725,
        transform: "scaleY(-1)",
    },
    "E": {
        id: "E",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 15.5% 100%, 0px 30%, 5.5% 0%)`,
        marginTop: 7.65,
        marginLeft: -1.475,
        transform: "rotate(95deg) scaleX(-1) scaleY(-1)",
    },
    "F": {
        id: "F",
        clipPath: `polygon(90% 0%, 100% 50%, 90% 100%, 7% 100%, 0px 73%, 11.5% 0%)`,
        marginTop: 2.425,
        marginLeft: -1.025,
        transform: "rotate(95deg)",
    },
    "G": {
        id: "G",
        clipPath: `polygon(86% 0%, 95% 51%, 83% 100%, 14% 100%, 6% 54%, 19% 0%)`,
        marginTop: 5,
        marginLeft: 1.175,
        transform: "none",
    }
};


    export let active;
    export let color;
    export let size;
    export let id;
    export let skew;

    $: ss = skew ? skewedSegmentStyle[id] : segmentStyle[id];

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
        width: ${size * 5}px;
    `;
</script>

<style>
    /* Add any additional styles if needed */
</style>

<div style={outerStyle}>
    <div style={innerStyle}></div>
</div>
