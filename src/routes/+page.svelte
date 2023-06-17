<script>
	export let data;
	console.log(data);

	let utterance = new window.SpeechSynthesisUtterance(data.chineseSentence);
	utterance.lang = 'zh-ZH';
	utterance.rate = 0.8;

	let traditional = false;

	// Clamp number between two values with the following line:
	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

	const characterSize = clamp(8 - data.chineseSentence.length / 6, 4, 8);

	function SetBackgroundImage() {
		// let words = new pos.Lexer().lex(translationText);
		// let tags = new pos.Tagger()
		//   .tag(words)
		//   .map(function (tag) {
		//     return tag[0] + "/" + tag[1];
		//   })
		//   .join(" ");

		// // debugger;
		// let nouns = chunker.chunk(tags, "[{ tag: NN|NNP|VBG }]");
		// // console.log(nouns);
		// let extractedNouns = [];
		// let nouns2 = [...nouns.matchAll(/\{([^}]+)\}/g)];
		// // console.log(nouns2);

		// for (let n of nouns2) {
		//   // console.log(n);
		//   extractedNouns.push(n[1].match(/(.*?)\//)[1]);
		// }

		// console.log("extractedNouns");
		// console.log(extractedNouns);

		// remove short words
		let extractedWords = data.translation.split(' ').filter((x) => x.length > 4);

		if (extractedWords.length == 0) {
			extractedWords = data.translation.split(' ').filter((x) => x.length > 3);
		}

		if (extractedWords.length == 0) {
			extractedWords = data.translation.split(' ').filter((x) => x.length > 2);
		}

		// remove words with apostrophe's like "didn't"
		let noApostrophes = extractedWords.filter((x) => x.indexOf("'") == -1);
		if (noApostrophes) extractedWords = noApostrophes;

		console.log('extractedWords');
		console.log(extractedWords);

		let backgroundImageURL = `url("https://source.unsplash.com/random/?${extractedWords.join()}")`;

		// console.log(backgroundImageURL);

		document.body.style.backgroundImage = backgroundImageURL;
	}

	SetBackgroundImage();
</script>

<main>
	<div id="container">
		<div class="rubyTexts">
			{#await data.streamed.definitions}
				{#each data.rubyTexts as rubyText}
					<div style="display: flex; flex-direction:column;align-items:center;">
						<ruby>
							<span
								class={traditional ? 'traditionalCharacter' : 'character'}
								style="font-size: {characterSize}em"
								>{traditional ? rubyText.traditionalChars : rubyText.chars}</span
							>
							<rt class="rubytext">{rubyText.pinyin}</rt>
						</ruby>
						<span
							class="definition"
							style="text-align: center; width: {rubyText.chars.length * 5}em"
							>{rubyText.definition || ''}</span
						>
					</div>
				{/each}
			{:then value}
				{#each value as rubyText}
					<div style="display: flex; flex-direction:column;align-items:center;">
						<ruby>
							<span
								class={traditional ? 'traditionalCharacter' : 'character'}
								style="font-size: {characterSize}em"
								>{traditional ? rubyText.traditionalChars : rubyText.chars}</span
							>
							<rt class="rubytext">{rubyText.pinyin}</rt>
						</ruby>
						<span
							class="definition"
							style="text-align: center; width: {rubyText.chars.length * characterSize}em"
							>{rubyText.definition || ''}</span
						>
					</div>
				{/each}
			{/await}
		</div>
	</div>
	{#if data !== undefined}
		<!-- <div class="rubyTexts">
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
		</div> -->

		<hr />

		<p>{data.translation}</p>

		<div id="button-container">
			<button on:click={() => speechSynthesis.speak(utterance)}>Speak Sentence</button>
			<button
				on:click={() =>
					traditional
						? navigator.clipboard.writeText(data.traditionalChineseSentence)
						: navigator.clipboard.writeText(data.chineseSentence)}>Copy Sentence</button
			>
			<button
				on:click={() => {
					traditional = !traditional;
				}}>Switch To {traditional ? 'Simplified' : 'Traditional'}</button
			>
		</div>
		<small style="opacity: 0.4">Seed: {data.seed}</small>
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

	hr {
		width: 70%;
	}

	.rubyTexts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		row-gap: 1em;

		padding: 0 4rem;
	}

	.character {
		/* font-size: clamp(12px, 2vw, 24px); */
		font-family: 'XingKai SC', 'XingKai TC', 'KaiTi', 'KaiTi TC', 'PingFang TC', 'serif';
		font-weight: bold;
		font-size: 5em;
	}
	.traditionalCharacter {
		/* font-size: clamp(12px, 2vw, 24px); */
		font-family: 'XingKai TC', 'XingKai SC', 'KaiTi', 'KaiTi SC', 'PingFang SC', 'serif';
		font-weight: bold;
	}

	#pinyinTextDiv {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		font-size: 1.8rem;
	}

	#pinyinTextDiv p {
		font-size: 1.8rem;
	}

	#container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		margin: 2rem 0;
	}

	#button-container {
		margin: 0.7rem;
	}

	.rubytext {
		font-size: clamp(12px, 1.4vw, 24px);
	}
	.definition {
		font-size: clamp(12px, 1.4vw, 24px);
	}
</style>
