<script lang="ts">
  import Tiptap from "./lib/Tiptap.svelte";
  import GitHubMark from './assets/github-mark.svg'
</script>

<main>
  <Tiptap/>

    <span>See code in
        <a href="https://github.com/axel7083/svelte-tiptap-mention/" target="_blank" rel="noopener noreferrer" class="github-link">
            GitHub
            <img style="width: 1rem" src={GitHubMark} alt="GitHub" class="github-icon" />
        </a>
    </span>
</main>
