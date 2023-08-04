<script>
    import {sendChatGPTRequest} from "./chatgptService.js";
    import {createWebSocket} from "./webSocketService.js";

    let textAreaValue = '';
    let recognizing = false;
    let recognizingStoppedManually = false;
    let recognition = null;
    let webSocketInstance = null;

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList =
        window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent =
        window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


    if (!SpeechRecognition) {
        alert("Your Browser does not support the Speech Recognition API. Please try with Google Chrome.");
    } else {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function() {
            recognizing = true;
        };

        recognition.onerror = function(event) {
            console.error(event.error);
        };

        recognition.onend = function() {
            console.log("recognizing ended");
            recognizing = false;
            if (!recognizingStoppedManually) {

                recognition.start();
            }
        };

        recognition.onresult = function(event) {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    let currentText = event.results[i][0].transcript;

                    setTimeout(() => {
                        getAnswerAndSendToClient(currentText)
                    }, 1000);
                    textAreaValue += currentText;
                }
            }
        };
    }



    async function getAnswerAndSendToClient(content){


        if(webSocketInstance == null){
            // let url="ws://localhost:9999";
            let url=localStorage.getItem('url');
            webSocketInstance = await createWebSocket(url);
        }
        let finalResponse = "";
        let chatGptRole= localStorage.getItem('chatGptRole');
        let apiKey= localStorage.getItem('apiKey');
        await sendChatGPTRequest(content, {apiKey,chatGptRole}, (input) => {
            const {content, done, error} = input;
            if (error) {
                webSocketInstance.sendError(error)
                // sendMessageToTab(requestingTab.id, {action: Actions.SHOW_ERROR, payload: error});
            } else {


                finalResponse += content;
                if (done) {
                    webSocketInstance.sendFinal(finalResponse)
                } else {
                    webSocketInstance.sendPartial(finalResponse)
                }

            }
        });
    }

    const startButton = () => {
        if (recognizing) {
            recognizingStoppedManually = true;
            recognition.stop();
            return;
        }else{
            recognizingStoppedManually = false;
            recognition.start();
        }

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
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
    }
</style>

<div class="form-container">
<textarea class="form-input" bind:value={textAreaValue} rows="10" cols="50"></textarea>
<button on:click={startButton} class="form-button">
    {#if recognizing}
        Stop
    {:else}
        Start
    {/if}
</button>
</div>
