export interface User {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export interface UpdateUser {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
}
