<script>
	export let data;
	console.log(data);

	let utterance = new window.SpeechSynthesisUtterance(data.chineseSentence);
	utterance.lang = 'zh-ZH';
	utterance.rate = 0.8;

	let traditional = false;

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
	{#await data.streamed.definitions}
		<div class="rubyTexts">
			{#each data.rubyTexts as rubyText}
				<div style="display: flex; flex-direction:column;align-items:center;">
					<ruby>
						<span class={traditional ? 'traditionalCharacter' : 'character'} style="font-size: 5em;"
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
	{:then value}
		<div class="rubyTexts">
			{#each value as rubyText}
				<div style="display: flex; flex-direction:column;align-items:center;">
					<ruby>
						<span class={traditional ? 'traditionalCharacter' : 'character'} style="font-size: 5em;"
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
	{/await}
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

		<div>
			<button on:click={() => speechSynthesis.speak(utterance)}>Speak Sentence</button>
			<button on:click={() => navigator.clipboard.writeText(data.chineseSentence)}
				>Copy Sentence</button
			>
			<button
				on:click={() => {
					traditional = !traditional;
				}}>Switch To {traditional ? 'Simplified' : 'Traditional'}</button
			>
		</div>
		<small>Seed: {data.seed}</small>
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
	}

	.character {
		font-family: 'XingKai SC', 'XingKai TC', 'serif';
		font-weight: bold;
	}
	.traditionalCharacter {
		font-family: 'XingKai TC', 'XingKai SC', 'serif';
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
	}
</style>
