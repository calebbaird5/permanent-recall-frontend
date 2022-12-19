<template>
	<v-card>
		<v-card-title> {{ passage.prompt }} </v-card-title>
		<v-card-text>
			<v-row>
				<v-col cols="12">
					<v-text-field
						label="Reference" v-model="reference"
						:class="{
										correct: referenceStatus === FieldStatus.correct,
										incorrect: referenceStatus === FieldStatus.incorrect,
										}"
						@keyup.enter.stop="() => checkReference() && textInput.focus()"
						/>
				</v-col>
				<v-col cols="12" v-if="referenceStatus === FieldStatus.incorrect">
					<WordDiff
						v-for="(el, i) in referenceDiff"
						:value="el"
						:key="i"
						@updateString="value => updateReference(value, i)"
						/>
				</v-col>
				<v-col cols="12">
					<v-textarea
						ref="textInput"
						filled
						name="passage-text"
						label="Text"
						auto-grow
						v-model="text"
						:class="{
										correct: textStatus === FieldStatus.correct,
										incorrect: textStatus === FieldStatus.incorrect,
										}"
						/>
				</v-col>
				<v-col cols="12" v-if="textStatus === FieldStatus.incorrect">
					<div class="diff">
						<WordDiff
							v-for="(el, i) in textDiff"
							:value="el"
							:key="i"
							@updateString="value => updateText(value, i)"
							/>
					</div>
					<v-btn
						color="blue darken-1"
						@click.stop="textStatus = FieldStatus.unmarked"
						> Hide Feedback</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions>
			<v-btn color="blue darken-1" text @click.stop="checkAnswers">
				Check Answers </v-btn>
			<v-spacer></v-spacer>
			<v-btn
				color="blue darken-1"
				text
				:loading="submitting"
				@click="markReviewed"
				> Mark as Reviewed </v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts" setup="setup">
const {passage} = defineProps<{passage: Passage}>()
import type { Ref } from 'vue'
import { Passage, DiffWord } from '@/models';
import { CommonAPI } from '@/api/common';

enum FieldStatus {
	incorrect = -1,
	unmarked,
	correct,
}

const stringDiff = (entered: string, expected: string): DiffWord => {
	let enteredWords = entered.split(' ');
	let expectedWords = expected.split(' ');
	let result = enteredWords.map((el, i) => {
		let expected = i < expectedWords.length ? expectedWords[i] : '';
		return {entered: el, expected, correct: el === expected}
	});
	if (enteredWords.length < expectedWords.length
		&& enteredWords[enteredWords.length - 1]) {
		result.push({
			entered: '',
			expected: expectedWords[enteredWords.length],
			correct: false,
		});
	}
	return result;
}

const referenceStatus = ref(FieldStatus.unmarked);
const reference = ref('');
const referenceDiff = computed(() =>
	stringDiff(reference.value, passage.reference));

const text = ref('');
const textInput = ref(null);
const textStatus = ref(FieldStatus.unmarked);
const textDiff = computed(() => stringDiff(text.value, passage.text));

const submitting = ref(false);

function checkReference() {
	let correct = passage.reference.toUpperCase()
		=== reference.value.toUpperCase();
	if (correct) {
		referenceStatus.value = FieldStatus.correct;
	} else {
		referenceStatus.value = FieldStatus.incorrect;
	}
	console.log('Reference is ' + (correct ? 'correct' : 'incorrect'))
	return  correct;
}

function checkText() {
	let correct = passage.text.toUpperCase()
		=== text.value.toUpperCase();
	if (correct) {
		textStatus.value = FieldStatus.correct;
	} else {
		textStatus.value = FieldStatus.incorrect;
	}
	console.log('Text is ' + (correct ? 'correct' : 'incorrect'))
	return  correct;
}

function checkAnswers() {
	let referenceCheck = checkReference();
	let textCheck = checkText();
	return referenceCheck && textCheck;
}

function getUpdatedWords(original: string, newValue: string, index: number)
: string {
	console.log(original);
	console.log('newValue: ', newValue);
	let words = original.split(' ');
	words.splice(index, 1, newValue);
	let newVal = words.join(' ');
	console.log(newVal)
	return newVal;
}

function updateReference(value, i) {
	reference.value = getUpdatedWords(reference.value, value, i);
	checkReference();
}

function updateText(value, i) {
	text.value = getUpdatedWords(text.value, value, i);
	checkText();
}

async function markReviewed() {
	if (!passage || ! passage.id) {
		console.log('cannot review passage... it is null')
		return;
	}

  submitting.value = true;
  try {
    let api = new CommonAPI('passages');
    let passage = await api.update(props.passage._id + '/review', {});
  } catch(e) { console.error(e) }
  submitting.value = false;
}
</script>

<style lang="scss" scoped>
.correct {
	:deep(.v-field__field) {
		border-bottom: 1px solid green;
	}
}

.incorrect {
	:deep(.v-field__field) {
		border-bottom: 1px solid red;
	}
}

.diff {
	margin-bottom: 10px;
}
</style>
