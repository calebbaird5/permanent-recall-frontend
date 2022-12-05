export interface Passage {
	_id: string;
	prompt: string;
	reference: string;
	reviewDates: Date[];
	text: string;
	displayReference?: Boolean;
	displayText?: Boolean;
}
