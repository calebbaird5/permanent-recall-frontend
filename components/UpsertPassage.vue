<template>
  <v-row>
		<v-col justify="center" align="center" >
			<v-dialog v-model="dialog" persistent max-width="600px">
				<template v-slot:activator="{ props }">
					<v-btn color="primary" dark @click="triggerCreatePassage">
						Create A New Passage </v-btn>
				</template>
				<v-card>
					<v-card-title>
						{{ props.passage ? 'Edit' : 'New' }} Passage
					</v-card-title>
					<v-card-text>
						<v-row>
							<v-col cols="12">
								<v-text-field
									label="Reference"
									v-model="reference"
									:rules="required"
									required
									/>
							</v-col>
							<v-col cols="12">
								<v-text-field
									label="Prompt"
									v-model="prompt"
									:rules="required"
									required
									/>
							</v-col>
							<v-col cols="12">
								<v-textarea
									filled
									name="passage-text"
									label="Text"
									auto-grow
									v-model="text"
									/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click.stop="close"> Close </v-btn>
						<v-btn
							color="blue darken-1"
							text
							:loading="submitting"
							@click="save"
							> Save </v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-col>
  </v-row>
</template>

<script lang="ts" setup="setup">
	const props = defineProps<{
		passage: Passage | null,
		editing: Boolean,
	}>()

const emit = defineEmits<{
	(e: 'closed') : void,
	(e: 'passageUpdated', passage: Passage) : void,
	(e: 'passageCreated', passage: Passage) : void,
}>();

import type { Ref } from 'vue'
import { Passage } from '@/models';
import { CommonAPI } from '@/api/common';

const prompt = ref('');
const reference = ref('');
const text = ref('');
const submitting = ref(false);
const dialog = ref(false);

onMounted(() => {
	if (props.passage && props.passage.value) {
		prompt.value = props.passage.prompt;
		reference.value = props.passage.reference;
		text.value = props.passage.text;
	}
})

watch(() => props.editing, (newValue) => {
  dialog.value = newValue;
});

watch(() => props.passage, (newValue) => {
  if (newValue) {
    prompt.value = newValue.prompt;
    reference.value = newValue.reference;
    text.value = newValue.text;
  } else {
    prompt.value = '';
    reference.value = '';
    text.value = '';
	}
});

const { required } = useFormValidation();

function close() {
	dialog.value = false;
  emit('closed');
}

function triggerCreatePassage() {
	dialog.value = true;
	prompt.value = '';
	reference.value = '';
	text.value = '';
}

async function save() {
  submitting.value = true;
  try {
    let api = new CommonAPI('passages');
    if (props.passage) {
      let passage = await api.update(props.passage._id, {
        prompt: prompt.value,
        reference: reference.value,
        text: text.value,
      });
      emit('passageUpdated', passage);

    } else {
      let passage = await api.create({
        prompt: prompt.value,
        reference: reference.value,
        text: text.value,
      });
			dialog.value = false;
      emit('passageCreated', passage);
    }
  } catch(e) { console.error(e) }
  submitting.value = false;
}
</script>
