export interface Passage {
	_id: string;
	prompt: string;
	reference: string;
	reviewDates: Date[];
	text: string;
	displayReference?: Boolean;
	displayText?: Boolean;
}

export interface DiffWord {
	expected: string;
	entered: string;
	correct: false;
}
