import { Status } from "@/enums/Status";

export interface User {
	id: number;
	name: string;
	email: string;
	picture?: string;
	googleId?: string;
	createdAt: string;
	updatedAt: string;
	status?: Status;
	privateChat?: string;
}
