import {getError, processStream} from "./chatgptStreamHandler.js";


export async function sendChatGPTRequest(message, options,callback) {

    const {  apiKey,chatGptRole} = options;
    const apiUrl="https://api.openai.com/v1/chat/completions";
    const model ="gpt-4"
    const tokens =500;

    const data = {
        "messages": [

            {"role": "system", "content": chatGptRole},
            {"role": "user", "content": message}
        ],
        "temperature": 0.7,
        "max_tokens": tokens,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "model": model,
        "stream": true
    };


    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    };


    try {

        const response = await fetch(apiUrl, requestOptions);

        if (!response.ok) {
            const errString = await getError(response);
            callback({ content: "", done:true,error:errString });
            return
        }

        await processStream(response, (input) => {

            const { done, value } =input;

            if (done) {
                //console.log(finalResponse);
                callback({ content: "", done:true,error:null });
            } else if (value.content) {
                callback({ content: value.content, done:false,error:null });
                //finalResponse += value.content;
            }
        });



    } catch (error) {
        console.error("Error fetching ChatGPT API:", error);
        callback({ content: "", done:true,error:error });
    }
}


