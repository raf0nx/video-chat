<template>
	<div class="chat-area flex-grow-1" :class="isPrivate ? 'pa-4' : 'pa-8'">
		<div
			v-for="(message, idx) in messages"
			:key="idx"
			class="d-flex"
			:class="getMessagePosition(message)"
		>
			<p
				v-if="!message.join"
				class="py-2 px-4 rounded-xl"
				:class="
					message.me ? 'chat-area__my-message' : 'chat-area__message'
				"
				v-message="message"
			></p>
			<p v-if="message.join" class="body-2 font-weight-bold">
				{{ message.message }}
			</p>
		</div>
	</div>
</template>

<script lang="ts">
	import { VNode } from "vue";
	import { Vue, Component, Prop } from "vue-property-decorator";
	import { DirectiveBinding } from "vue/types/options";

	import { Message } from "@/interfaces/Message";
	import MessageDirective from "@/directives/message";

	@Component({
		directives: {
			message: {
				bind: function (
					el: HTMLElement,
					binding: DirectiveBinding,
					vnode: VNode
				): void {
					MessageDirective(el, binding, vnode.context as ChatArea);
				},
			},
		},
	})
	export default class ChatArea extends Vue {
		@Prop() messages!: Message[];
		@Prop() maxMessageLength!: number;
		@Prop({ default: false }) isPrivate!: boolean;

		getMessagePosition(message: Message): string {
			if (message.join) {
				return "justify-center";
			}

			return message.me ? "justify-end" : "justify-start";
		}

		getChunkText(message: string, maxLength: number, index: number): string {
			let newMessage = "";

			for (let i = 0; i < index; i++) {
				const newChunk = message.slice(i * maxLength, maxLength * (i + 1));

				if (i !== 0) {
					newMessage += "<br>";
				}

				newMessage += `<span> ${newChunk} </span>`;
			}

			return newMessage;
		}
	}
</script>

<style>
	.chat-area {
		overflow-x: scroll;
		flex-basis: 0px;
	}
	.chat-area .body-2 {
		font-family: "Nunito", sans-serif !important;
	}
	.chat-area__message {
		background-color: #272727;
	}
	.chat-area__my-message {
		background-color: #000000;
	}
</style>