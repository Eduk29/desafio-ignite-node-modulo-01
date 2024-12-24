import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('../../data.csv', import.meta.url);
const csvStream = fs.createReadStream(csvPath);
const csvParser = parse({
    delimiter: ',',
    fromLine: 2
});

const run = async () => {
    const lineToParse = csvStream.pipe(csvParser);

    for await (const line of lineToParse) {
        const [ title, description ] = line;

        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
    }
}

run();