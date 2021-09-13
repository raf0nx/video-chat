import { DirectiveBinding } from 'vue/types/options';

import ChatArea from '@/components/ChatArea.vue';

export default function message(
	element: HTMLElement,
	binding: DirectiveBinding,
	vNodeCtx: ChatArea
) {
	// @ts-ignore
	const maxLength = vNodeCtx.maxMessageLength;
	let chunks;

	if (binding.value.username) {
		chunks = Math.ceil(binding.value.message.length / maxLength);
		element.innerHTML = 
        // @ts-ignore
        `<span style="font-weight:bold">${binding.value.username}</span>: ${vNodeCtx.getChunkText(binding.value.message, maxLength, chunks)}
            `;
	} else {
		chunks = Math.ceil(binding.value.message.length / maxLength);
		// @ts-ignore
		element.innerHTML = vNodeCtx.getChunkText(
			binding.value.message,
			maxLength,
			chunks
		);
	}
}
