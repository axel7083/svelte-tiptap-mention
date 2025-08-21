<script lang="ts">
import { computePosition, flip, shift } from '@floating-ui/dom'
import { type Editor, posToDOMRect} from "@tiptap/core";

interface Props {
    items: Array<any>;
}

let { items }: Props = $props();

let selectedIndex = $state(0);
let hidden = $state(true);
let element: HTMLDivElement;

type Command = (options: { id: string }) => void;
let command: Command | undefined = $state(undefined);

function selectItem(item: any) {
    command?.({ id: item })
}

export function hide(): void {
    command = undefined;
    hidden = true;
}

export function show(mCommand: Command): void {
    command = mCommand;
    hidden = false;
}

export function onkeydown(event: KeyboardEvent): boolean {
    if (event.repeat) {
        return false;
    }

    switch (event.key) {
        case "ArrowUp":
            selectedIndex = (selectedIndex + items.length - 1) % items.length
            return true
        case "ArrowDown":
            selectedIndex = (selectedIndex + 1) % items.length
            return true
        case "Enter":
            selectItem(items[selectedIndex]);
            return true
    }
    return false
}

export function updatePosition(editor: Editor): void {
    const virtualElement = {
        getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
    }

    computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()],
    }).then(({ x, y, strategy }) => {
        element.style.width = 'max-content'
        element.style.position = strategy
        element.style.left = `${x}px`
        element.style.top = `${y}px`
    })
}

</script>
<style>
    .is-selected {
        background-color: #f0f0f0;
    }
</style>

<div bind:this={element}
     hidden={hidden}
     class="dropdown-menu"
     style="display: flex; flex-direction: column; z-index: 1000;">
    {#if items.length}
        {#each items as item, index}
            <button hidden={hidden}
                    class={index === selectedIndex ? 'is-selected' : ''}
                    onclick={selectItem.bind(undefined, item)}
            >
                {item}
            </button>
        {/each}
    {:else}
        <div hidden={hidden} class="item">No result</div>
    {/if}
</div>
