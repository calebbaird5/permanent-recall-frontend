<template>
	<span v-if="value && value.correct"
				:class="{'diff-word': true, incorrect: !value || !value.correct}"
				>{{  value.expected }}</span>
	<v-dialog v-else v-model="dialog">
		<template #activator>
			<button
				@click="() => dialog = true"
				:class="{'diff-word': true, incorrect: !value || !value.correct}"
				> {{ value.entered || '...' }} </button>
		</template>
		<v-card>
			<v-card-text>
				<v-text-field v-model="text" @keyup.enter.stop="update" />
				<div>
					<v-btn
						class="no-text-transform"
						density="comfortable"
						variant="flat"
						@click="fix"
						v-if="showCorrect"
						> {{ value.expected }}</v-btn>
				</div>
				<v-btn
					density="comfortable"
					class="text-capitalize"
					@click="showCorrect = true"
					> Show correct word</v-btn>
			</v-card-text>
			<v-card-actions>
				<v-btn color="blue darken-1" text @click.stop="dialog = false">
					Close </v-btn>
				<v-btn color="blue darken-1" text @click="update"> Update </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup="setup">
	const props = defineProps<{value: DiffWord}>()
const { value } = toRefs(props)
import { DiffWord } from '@/models';

const emit = defineEmits<{
	(e: 'updateString', s: string) : void
}>();

const text = ref('');
const dialog = ref(false);
const showCorrect = ref(false);

onMounted(() => {
	if (value.entered) {
		text.value = value.entered;
	}
})

function fix() {
	if (value.value.expected) {
		text.value = value.value.expected;
		update();
	} else {
		console.log(value.value)
	}


}

function update() {
	emit('updateString', text.value);
	dialog.value = false;
}

</script>

<style lang="scss" scoped>
.diff-word {
	padding-left: 2px;
	padding-right: 2px;
	margin-right: 1px;

	&.incorrect {
		background: #F005;
	}
}

:deep(.no-text-transform) {
	text-transform: none;
}

</style>
