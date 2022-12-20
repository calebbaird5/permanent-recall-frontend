export interface Setting {
	_id: string;
	name: string;
	value: string;
	user: { id: string };
}
