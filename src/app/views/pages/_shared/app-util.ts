const usertypeName = 'user_type';
export function isAdmin(): boolean {
	return localStorage.getItem(usertypeName) === '2';
}

export function isTeacher(): boolean {
	return localStorage.getItem(usertypeName) === '3';
}

export function isParent(): boolean {
	return localStorage.getItem(usertypeName) === '4';
}

export function isStudent(): boolean {
	return localStorage.getItem(usertypeName) === '5';
}

export function isAccountant(): boolean {
	return localStorage.getItem(usertypeName) === '6';
}

export function isReceptionist(): boolean {
	return localStorage.getItem(usertypeName) === '7';
}

export function isLibrarian(): boolean {
	return localStorage.getItem(usertypeName) === '8';
}