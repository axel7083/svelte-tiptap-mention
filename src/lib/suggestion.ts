import type { SuggestionOptions } from '@tiptap/suggestion';
import MentionList from "./MentionList.svelte";

const dummyData = ['test', 'mention', 'hashtag'];

export default function (overlay: MentionList): Omit<SuggestionOptions, 'editor'> {
    return {
        items: ({ query }) => {
            return dummyData
                .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 5);
        },
        render: () => ({
            onStart: ({ editor, command, items }) => {
                overlay.setItems(items);
                overlay.show(command);
                overlay.updatePosition(editor)
            },
            onUpdate: ({ editor, items }) => {
                overlay.updatePosition(editor);
                overlay.setItems(items);
            },
            onExit: () => {
                console.log('onExit')
                overlay.hide()
            },
            onKeyDown: ({ event }) => {
                if (event.key === 'Escape') {
                    overlay.hide();
                    return true
                }
                return overlay.onkeydown?.(event);
            },
        })
    }
}
