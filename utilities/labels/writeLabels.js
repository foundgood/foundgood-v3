const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

async function getLabels() {
    try {
        const { status, statusText, data } = await axios.get(
            `${process.env.NEXT_PUBLIC_ELSEWARE_URL}/api/label/label`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Convert non-ok HTTP responses into errors:
        if (status !== 200) {
            throw {
                statusText: statusText,
            };
        }

        return data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function extractToJsonFile() {
    try {
        const data = await getLabels();
        fs.rmSync('_labels', { recursive: true, force: true });
        fs.mkdirSync('_labels', { recursive: true });
        fs.writeFile('_labels/labels.json', JSON.stringify(data), err => {
            console.info('Labels from DatoCMS written to file');
        });
    } catch (error) {
        fs.rmSync('_labels', { recursive: true, force: true });
        fs.mkdirSync('_labels', { recursive: true });
        fs.writeFile(
            '_labels/labels.json',
            JSON.stringify({ labels: null, valueSets: null, types: null })
        );
        throw new Error(error);
    }
}

module.exports = { extractToJsonFile };
