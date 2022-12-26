<template>
	<div class="v-field">
		<div class="v-field__field v-field--variant-filled">
			<label class="v-field-label v-label">{{ label }}</label>
			<div class="v-field__overlay"></div>
			<div class="v-field__input">
				<datepicker v-model="date" :clearable="clearable" />
			</div>
		</div>
		<div class="v-field-details">
			<div class="v-messages"></div>
		</div>
	</div>

</template>

<script lang="ts" setup="setup">
	import Datepicker from 'vue3-datepicker'

const props = defineProps<{
	modelValue: Date | null,
	clearable: boolean,
	label: string,
}>()

const emit = defineEmits<{
	(e: 'update:modelValue') : Date | null,
}>();

const date = computed({
	get: () => props.modelValue,
	set: value => emit('update:modelValue', value),
})
</script>

<style></style>
