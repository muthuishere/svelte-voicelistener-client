
export async function processStream(response, callback) {


    const reader = response.body.getReader();
    try {
        while (true) {
            const {done, value} = await reader.read();



            if (!done) {
                getAsLines(value)
                    .filter(isJson)
                    .map(getAsJson)
                    .forEach(res => callback({value: res, done:false}));

            } else {
                callback({value: {}, done:true})
                break;
            }


        }
    } finally {
        reader.releaseLock();
    }
}

function getAsLines(value) {
    let data = "";
    // check value is uint8array
    if ((value instanceof Uint8Array)) {
        data = new TextDecoder("utf-8").decode(value);
    }else {
        data = value;
    }

    return data.split("\n")
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
        .map((i) => i.replace("data: ", ""));

}


function isJson(value) {
    try {
        JSON.parse(value);
    } catch (ex) {
        return false;
    }
    return true;


}
function getAsJson(value) {

    let data = {};
    try {

        data = JSON.parse(value);

        const content = data.choices
            .map(i => i.delta)
            .filter((i) => i.hasOwnProperty("content"))
            .map((i) => i.content)
            .reduce((acc, cur) => acc + cur, "");

        return {...data, content};
    } catch (ex) {
        console.log(ex);
        return data;

    }


}


export async function readErrorResponse(response) {

    let finalResponse = "";
    const reader = response.body.getReader();
    try {
        while (true) {
            const {done, value} = await reader.read();


            if (!done) {

                finalResponse += getAsLines(value)
                    .reduce((acc, cur) => acc + cur, "");

            } else {

                break;
            }


        }
    } finally {
        reader.releaseLock();
    }
    return finalResponse;
}

export async function getError(response) {
    const err = await readErrorResponse(response);

    const {status} = response;
    let errorObject = JSON.parse(err);
    errorObject = errorObject || {error: {}};
    const error = {status, ...errorObject};
    let {code, message} = error.error;
    code = code || "";
    message = message || "";
    const errorString = `ChatGPT API Error :  ${code}  ${message}   HTTP Status Code: ${status}.<br/> Try Changing the key or contact support.`;
   return  errorString;
}
