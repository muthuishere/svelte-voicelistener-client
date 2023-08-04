<script>
    import { onMount } from 'svelte';
    let apiKey = '';
    let url = '';
    let chatGptRole = '';

    // Load the data from localStorage when the component mounts
    onMount(() => {
        const savedApiKey = localStorage.getItem('apiKey');
        const savedUrl = localStorage.getItem('url');
        const savedChatGptRole = localStorage.getItem('chatGptRole');

        if (savedApiKey) {
            apiKey = savedApiKey;
        }

        if (savedUrl) {
            url = savedUrl;
        }
        if (savedChatGptRole) {
            chatGptRole = savedChatGptRole;
        }else {
            chatGptRole = "You are a helpful assistant answering Java Interview questions.if any of the below messages does not look like a question , say no , or else answer in abstract"
        }
    });

    const submitForm = async () => {
        // check if the api key is provided
        if (!apiKey) {
            alert("API key is required");
            return;
        }
        if (!url) {
            alert("wsUrl is required");
            return;
        }
        if (!chatGptRole) {
            alert("chatGptRole is required");
            return;
        }

        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('url', url);
        localStorage.setItem('chatGptRole', chatGptRole);

    };
</script>

<style>
    .form-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .form-input {
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 16px;
    }

    .form-button {
        margin-top: 10px;
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }
    .form-text {
        color: #6c757d; /* or any color you prefer */
        font-size: 0.875em; /* or any size you prefer */
    }
</style>

<div class="form-container">
    <h2>Enter chatGptRole to play</h2>
    <textarea class="form-input" bind:value={chatGptRole} rows="10" cols="50"></textarea>
    <h2>Enter URL</h2>
    <input type="text" bind:value={url} class="form-input" placeholder="ws://localhost:9999" />

    <small id="urlHelp" class="form-text text-muted">WebSocket URL. Example: ws://localhost:9999 - (replace localhost with your wifi address)</small>

    <h2>Enter your API key</h2>
    <input type="password" bind:value={apiKey} class="form-input" placeholder="API key..." />
    <small id="passwordHelp" class="form-text text-muted">Get an OpenAi Key</small>

    <button on:click={submitForm} class="form-button">Save</button>
</div>
