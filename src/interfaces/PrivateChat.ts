import { Message } from "./Message";

export interface PrivateChat {
  openChat: boolean;
  user: string;
  messages: Message[];
  room: string;
  closed: boolean;
}
