<template>
	<v-icon
		:icon="props.modelValue ? props.onIcon : props.offIcon"
		@click="emit('update:modelValue', !props.modelValue)"
		/>
</template>
<script lang="ts" setup="setup">

	interface Props {
		modelValue: boolean;
		onIcon?: string;
		offIcon?: string;
	}

const props = withDefaults(defineProps<Props>(), {
	modelValue: true,
	onIcon: 'mdi-eye',
	offIcon: 'mdi-eye-off',
})

const emit = defineEmits<{
	(e: 'update:modelValue', modelValue: boolean) : void,
}>();
</script>

<style lang="scss" scoped>
button {
	padding: 2px;
}
</style>
