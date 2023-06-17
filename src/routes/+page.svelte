<script>
	export let data;
	console.log(data);

	let utterance = new window.SpeechSynthesisUtterance(data.chineseSentence);
	utterance.lang = 'zh-ZH';
	utterance.rate = 0.8;

	let traditional = false;
</script>

<main>
	{#if data !== undefined}
		<div class="rubyTexts">
			{#each data.rubyTexts as rubyText}
				<div style="display: flex; flex-direction:column;align-items:center;">
					<ruby>
						<span style="font-size: 5em;"
							>{traditional ? rubyText.traditionalChars : rubyText.chars}</span
						>
						<rt>{rubyText.pinyin}</rt>
					</ruby>
					<span style="text-align: center; width: {rubyText.chars.length * 5}em"
						>{rubyText.definition || ''}</span
					>
				</div>
			{/each}
		</div>

		<p>{data.translation}</p>
		<small>{data.seed}</small>

		<button on:click={() => speechSynthesis.speak(utterance)}>Speak Sentence</button>
		<button on:click={() => navigator.clipboard.writeText(data.chineseSentence)}
			>Copy Sentence</button
		>
		<button
			on:click={() => {
				traditional = !traditional;
			}}>Switch To {traditional ? 'Simplified' : 'Traditional'}</button
		>
	{:else}
		<p style="color:red;">loading...</p>
	{/if}
</main>

<style>
	/* .rubyTexts {
		font-size: 4em;
	} */
	ruby > rt {
		/* display: block; */
		font-size: 100%;
		/* text-align: start; */
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.rubyTexts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		row-gap: 1em;
	}
</style>
