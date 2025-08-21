<script lang="ts">
import { computePosition, flip, shift } from '@floating-ui/dom'
import { type Editor, posToDOMRect} from "@tiptap/core";
import type { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';

let selectedIndex = $state(0);
let hidden = $state(true);
let element: HTMLDivElement;

let items = $state<Array<string>>([]);

type Command = (options: { id: string }) => void;
let command: Command | undefined = $state(undefined);

function setItems(newItems: Array<string>): void {
    items = newItems;
    selectedIndex = 0;
}

function selectItem(item: any) {
    command?.({ id: item })
}

async function updatePosition(editor: Editor): Promise<void> {
    const virtualElement = {
        getBoundingClientRect: () => {
            const rect = posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to);
            return rect;
        },
    }

    const { x, y, strategy } = await computePosition(virtualElement, element, {
        placement: 'bottom-start',
        strategy: 'absolute',
        middleware: [shift(), flip()],
    });
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
}

/**
 *
 * @param props
 */
export function onStart(props: SuggestionProps<string, { id: string }>): void {
    if (!props.clientRect) {
        return
    }

    command = props.command;
    items = props.items;
    hidden = false;
    selectedIndex = 0;

    updatePosition(props.editor);
}

/**
 *
 */
export function onExit(props: SuggestionProps<string, { id: string }>): void {
    command = undefined;
    items = [];
    hidden = true;
}

/**
 *
 * @param props
 */
export function onUpdate(props: SuggestionProps<string, { id: string }>): void {
    // update states
    command = props.command;
    items = props.items;

    // update position
    updatePosition(props.editor);
}

/**
 *
 * @param props
 */
export function onKeyDown({ event }: SuggestionKeyDownProps): boolean {
    if (event.repeat) {
        return false;
    }

    switch (event.key) {
        case 'Escape':
            hidden = true;
            return true;
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
</script>
<style>
    .is-selected {
        background-color: #f0f0f0;
    }
</style>

<div bind:this={element}
     hidden={hidden}
     class="dropdown-menu"
     style="display: flex; flex-direction: column; z-index: 1000;width: max-content; position: absolute;">
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
