export async function bufferConverter(request, response) {
    const buffer = [];

    for await (const chunk of request) {
        buffer.push(chunk);
    }

    try {
        request.body = JSON.parse(Buffer.concat(buffer).toString());
        response.setHeader("Content-Type", "application/json");
    } catch {
        console.error("Error parsing the body");
        request.body = null;
        response.writeHead(400);
    }
}