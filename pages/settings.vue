<template>
	<v-card>
		<v-card-title> Settings </v-card-title>

		<v-card-text>
			<v-checkbox
				label="Strict Punctuation"
				v-model="strictPunctuation"
				/>

			<v-checkbox
				label="Strict Capitalization"
				v-model="strictCapitalization"
				/>
		</v-card-text>

		<v-card-actions>
			<v-spacer />
			<v-btn color="blue darken-1" :loading="submitting" @click="save">
				Save </v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts" setup="setup">
	import { CommonAPI } from '@/api/common';

const strictPunctuation = ref(false);
const strictCapitalization = ref(false);
const submitting = ref(false);

import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore();

onMounted(async () => {
	if (settings.strictCapitalization)
		strictCapitalization.value = settings.strictCapitalization.value

	if (settings.strictPunctuation)
		strictPunctuation.value = settings.strictPunctuation.value
});

async function upsertSetting(storeSetting, value) {
	let setting: Setting;
	let api = new CommonAPI('settings');
	if (!storeSetting.setting._id) {
		setting = await api.create({
			name: storeSetting.setting.name,
			value: value + '',
		})
	} else if (storeSetting.value !== value) {
		setting = await api.update(
			storeSetting.setting._id, { value: value + '' });
	}
	return setting;
}

async function save() {
	try {
		let setting = await upsertSetting(
			settings.strictCapitalization, strictCapitalization.value);
		if (setting) settings.setStrictCapitalization(setting);

		setting =  await upsertSetting(
			settings.strictPunctuation, strictPunctuation.value);
		if (setting) settings.setStrictPunctuation(setting);

	} catch (e) { console.error(e) }
}

</script>

<style lang="scss" scoped>
</style>
