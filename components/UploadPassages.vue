<template>
	<v-dialog v-model="dialog" persistent max-width="800px">
		<template #activator>
			<v-btn @click="dialog = true" append-icon="mdi-upload">
				Upload Passages </v-btn>
		</template>
		<v-card>
			<v-card-title> Upload Passages </v-card-title>
			<v-card-text>
				<v-radio-group label="Upload Type" inline v-model="uploadType">
					<v-radio label="JSON" :value="UploadTypes.json" />
					<v-radio label="CSV" :value="UploadTypes.csv" />
				</v-radio-group>

				<v-progress-circular
					indeterminate :size="69" v-if="uploadType && loading" />
				<template v-else-if="uploadType">
					<v-checkbox
						label="Manually Enter Review Dates"
						v-model="manuallyFillDates"
						hint="test"
						/>
					<DatePicker v-model="startDate" clearable label="Start Date" />
					<div class="content-preview">
						<v-textarea
							name="file-contents"
							label="Upload Contents"
							auto-grow
							v-model="fileContents"
							/>
					</div>
					<v-file-input density="compact" label="or select file from computer">
						Upload Passages </v-file-input>
				</template>
			</v-card-text>
			<v-card-actions>
				<v-btn
					color="blue darken-1"
					class="no-text-transform"
					append-icon="mdi-upload"
					:loading="uploading"
					@click="upload"
					> Upload Passages</v-btn>
				<v-btn @click="dialog = false"> Close </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts" setup="setup">
	import { Passage } from '@/models/passage.model.ts'

enum UploadTypes {
	unspecified = 0,
	json,
	csv,
}

const uploadType = ref(UploadTypes.unspecified);

interface DefaultContent {
	json: {
		withDates: string;
		withoutDates: string;
	};
	csv: {
		withDates: string;
		withoutDates: string;
	};
}

const loading = ref(false);
const fileContents = ref('');
const manuallyFillDates = ref(false);
const startDate = ref(null);
const uploading = ref(false);
const dialog = ref(false);

const defaultContent: DefaultContent  = ref({
	json: { withDates: '', withoutDates: '' },
	csv: { withDates: '', withoutDates: '' },
})

import { CommonAPI } from '@/api/common';
onMounted(async () => {
	loading.value = true;
	try {
		let api = new CommonAPI('passages');
		defaultContent.value.json.withDates = await api.get(
			'/uploadFormat', {uploadType: 'json', autoFillDates: 'false'})
		defaultContent.value.json.withoutDates = await api.get(
			'/uploadFormat', {uploadType: 'json', autoFillDates: 'true'})
		defaultContent.value.csv.withDates = await api.get(
			'/uploadFormat', {uploadType: 'csv', autoFillDates: 'false'})
		defaultContent.value.csv.withoutDates = await api.get(
			'/uploadFormat', {uploadType: 'csv', autoFillDates: 'true'})
	} catch(e) { console.error(e) }
	loading.value = false;
})

watch(dialog, () => uploadType.value = UploadTypes.unspecified);

watch(
	[uploadType, manuallyFillDates],
	([uploadTypeValue, manuallyFillDatesValue]) => {
		switch (uploadTypeValue) {
			case UploadTypes.json:
				if (manuallyFillDatesValue) {
					fileContents.value = defaultContent.value.json.withDates;
				} else {
					fileContents.value = defaultContent.value.json.withoutDates;
				}
				break;

			case UploadTypes.csv:
				if (manuallyFillDatesValue) {
					fileContents.value = defaultContent.value.csv.withDates;
				} else {
					fileContents.value = defaultContent.value.csv.withoutDates;
				}
				break;

			default:
				fileContents.value = '';
		}
	})

async function upload() {
	uploading.value = true;
	let uploadedPassages: Passage[] = [];
	try {
		let api = new CommonAPI('passages/upload');
		switch (uploadType.value) {
			case UploadTypes.json:
				let requestBody: any = {passages: JSON.parse(fileContents.value)};
				if (manuallyFillDates.value) {
					requestBody.manuallyFillDates = true;
				}

				uploadedPassages = await api.create(requestBody);
				break;

			case UploadTypes.csv:
				if (manuallyFillDates.value) {
				} else {
				}
				break;

			default:
				console.error('Cannot do the upload without a valid uploadType.');
		}
		console.log('uploadedPassages', uploadedPassages)
	} catch(e) { console.error(e) }
	uploading.value = false;
}
</script>
