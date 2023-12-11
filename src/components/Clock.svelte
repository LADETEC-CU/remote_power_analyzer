<script lang="ts">
	import { time } from '$components/props/clock';

	const formatter = new Intl.DateTimeFormat('en', {
		hour12: true,
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit'
	});
</script>

<span class="text-center">
	<h1 class="text-2xl">Hora local: {formatter.format($time)}</h1>
</span>
