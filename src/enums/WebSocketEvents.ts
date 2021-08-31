export enum WebSocketEvents {
	JOIN_PRIVATE_ROOM = 'joinPrivateRoom',
	JOIN_ROOM = 'joinRoom',
	LEAVE_ROOM = 'leaveRoom',
	PUBLIC_MESSAGE = 'publicMessage',
	LEAVE_PRIVATE_ROOM = 'leavePrivateRoom',
	LEAVE_CHAT = 'leaveChat',
	CHANGE_STATUS = 'changeStatus',
	PRIVATE_MESSAGE = 'privateMessage',
	PRIVATE_MESSAGE_PC_SIGNALING = 'privateMessagePCSignaling',
	PC_SIGNALING_CONFERENCE = 'PCSignalingConference',
	CONFERENCE_INVITATION = 'conferenceInvitation',
	JOIN_CONFERENCE = 'joinConference',
	LEAVE_CONFERENCE = 'leaveConference',
}
