<template>
	<div class="rows">
		<v-row>
			<v-col cols="12" align="center">
				<UpsertPassage
					class="create"
					:editing="editing"
					:passage="passageToEdit"
					:allowImport="!passageToEdit"
					@closed="stopEditing"
					@passageCreated="addPassage"
					@passageUpdated="updatePassage"
					/>
			</v-col>
		</v-row>
		<v-progress-circular v-if="loading" indeterminate color="black" />
		<v-row
			v-else
			v-for="passage in passages"
			:key="passage._id"
			justify="center"
			align="center"
			>
			<v-col>
				<v-card>
					<v-card-title class="card-title" @click="handleClick('prompt', passage)">
						<span class="prompt"> {{ passage.prompt }} </span>
						<v-btn
							@click.stop="clickEdit(passage)"
							icon="mdi-pencil"
							size="small"
							/>
						<v-spacer />
						<v-btn
							@click.stop="clickTrash(passage)"
							icon="mdi-delete"
							class="text-red"
							/>
					</v-card-title>

					<v-card-subtitle
						class="reference"
						v-if="passage.displayReference"
						@click="handleClick('reference', passage)"
						>
						{{ passage.reference }}
					</v-card-subtitle>

					<v-card-text v-if="passage.displayText" >
						{{ passage.text }}
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog v-model="confirmDelete" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="text-h5"> Are you sure you want to delete this passage?</span>
				</v-card-title>
				<v-card-text>
					This cannot be undone and will make you loose all reveiw history for this passage.
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" @click="confirmDelete = false">
						Never Mind </v-btn>
					<v-btn color="red darken-1" :loaining="deleting" @click="deletePassage">
						Yes Delete </v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts" setup="setup">
	definePageMeta({middleware: ['auth']});
import { Passage } from '../../models';

const passages: Ref<Passage[]> = ref([]);
const passageToDelete: Ref<Passage | null> = ref(null);
const passageToEdit: Ref<Passage | null> = ref(null);
const confirmDelete = ref(false);
const deleting = ref(false);
const editing = ref(false);
const loading = ref(false);

import { CommonAPI } from '../../api/common';
onMounted(async () => {
  loading.value = true;
  try {
    let api = new CommonAPI('passages');
    let dbPassages = await api.list();
    passages.value.push(...dbPassages.map((el: Passage) => ({
      ...el, displayReference: false, displayText: false})));
  } catch(e) { console.error(e); }
  loading.value = false;
	stopEditing()
})

function addPassage(passage: Passage) {
  passages.value.push({
    ...passage, displayReference: false, displayText: false});
}

function updatePassage(passage: Passage) {
  let passageIndex = passages.value.findIndex(el =>
    el._id === passage._id);
  if (passageIndex < 0) {
    console.error('Failed to find updated passage in the passage list.');
    return;
  }

  passage.displayReference = passages.value[passageIndex].displayReference;
  passage.displayText = passages.value[passageIndex].displayText;

  passages.value.splice(passageIndex, 1, passage);
  editing.value = false;
}

async function deletePassage() {
  if (!passageToDelete) {
    console.error('There is no passage marked for deletion')
    return;
  }

  deleting.value = true;
  try {
    let api = new CommonAPI('passages');
    await api.delete(passageToDelete.value._id);
    passages.value = passages.value.filter(el =>
      el._id !== passageToDelete.value._id);
    passageToDelete = null;
  } catch(e) { console.error(e); }
  deleting.value = false;
  confirmDelete.value = false;
}

function clickTrash(passage: Passage) {
  passageToDelete.value = passage;
  confirmDelete.value = true;
}

function clickEdit(passage: Passage) {
  passageToEdit.value = passage;
  editing.value = true;
}

function stopEditing() {
  passageToEdit.value = null;
  editing.value = false;
}

function handleClick(label: string, passage: Passage) {
  switch (label) {
    case 'prompt':
      if (passage.displayText) {
        passage.displayText = false;
        passage.displayReference = false;
      } else {
        passage.displayReference = !passage.displayReference;
      }
      break;
    case 'reference':
      passage.displayText = !passage.displayText;
      break;
    default:
      console.error('unrecognized label in handleClick');
  }
}
</script>

<style lang="scss" scoped>
.card-title {
	display: flex;
	align-items: center;
}

.v-card {
  margin: 10px;
}

.v-card-title {
	padding-left: 15px;
	padding-right: 15px;
	justify-content: space-between;

	button {
		box-shadow: unset;
	}
}

@mixin separator {
	&::before {
		content: '';
		position: absolute;
		border-top: 1px solid black;
		top: 0;
		right: 25px;
		left: 25px;
	}
}

.v-card-subtitle {
	justify-content: center;
  padding-bottom: 12px;
  padding-top: 10px;
	position: relative;
	@include separator;
}

.v-card-text {
	position: relative;
	@include separator;
}
</style>
