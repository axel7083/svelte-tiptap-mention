<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import suggestion from './suggestion'
import Mention from '@tiptap/extension-mention'
import MentionList from "./MentionList.svelte";

let element: HTMLDivElement;
let editor: Editor;

let mentionList: MentionList;

onMount(() => {
    editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: suggestion(mentionList),
            }),
        ],
        content: '<p>Use @ to mention</p>',
        onTransaction: () => {
            // force re-render so `editor.isActive` works as expected
            editor = editor;
        },
    });
});

onDestroy(() => {
    if (editor) {
        editor.destroy();
    }
});
</script>

{#if editor}
    <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            class:active={editor.isActive('heading', { level: 1 })}
    >
        H1
    </button>
    <button
            on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            class:active={editor.isActive('heading', { level: 2 })}
    >
        H2
    </button>
    <button
            on:click={() => editor.chain().focus().setParagraph().run()}
            class:active={editor.isActive('paragraph')}
    >
        P
    </button>
{/if}

<MentionList bind:this={mentionList} />

<div bind:this={element} />

