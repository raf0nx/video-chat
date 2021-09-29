import { Status } from '@/enums/Status';

export interface User {
	username: string;
	status: Status;
	privateChat: string;
}
