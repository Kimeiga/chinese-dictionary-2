<!-- src/routes/$layout.svelte -->
<script>
	import { loading } from '$lib/loading';
	import { onMount } from 'svelte';
	import './styles.css';
</script>

<div class="app">
	{#if $loading}
		<div>Loading...</div>
	{:else}
		<p>hi</p>
		<slot />
	{/if}
</div>
