<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import {Editor, type NodeType, type TextType} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention'
import MentionList from "./MentionList.svelte";

interface Props {
    items: Array<string>;
}

let { items }: Props = $props();

// Editor instance
let editor: Editor;

// HTML element
let element: HTMLDivElement;
let mentionList: MentionList;

let mentions: Array<string> = $state([]);

function collect(node: NodeType): Array<string> {
    if(node.type === 'mention') {
        return [node.attrs.id];
    } else {
        return (node.content)?.reduce((accumulator: Array<string>, child: NodeType) => {
            if(child.type === 'text') return accumulator;
            return accumulator.concat(collect(child));
        }, [] as Array<string>) ?? [];
    }
}

onMount(() => {
    editor = new Editor({
        element: element,
        extensions: [
            StarterKit,
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: {
                    items: ({ query }) => {
                        return items
                            .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
                            .slice(0, 5);
                    },
                    render: () => mentionList
                },
            }),
        ],
        content: '<p>Use @ to mention</p>',
        onTransaction: () => {
            // collect mentions
            const documents = editor.getJSON();
            mentions = collect(documents);

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

<ul>
    {#each mentions as mention}
        <li>{mention}</li>
    {/each}
</ul>

