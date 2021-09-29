export interface VideoAnswer {
	video: boolean;
	remoteDesc: RTCSessionDescriptionInit | string;
	candidate: RTCIceCandidateInit | string;
	close: boolean;
	from?: string;
}
