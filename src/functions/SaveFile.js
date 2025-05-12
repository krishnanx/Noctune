import { createFile, writeFile, openDocumentTree, listFiles } from 'react-native-saf-x';
import { Buffer } from 'buffer';

/**
 * Save a file using react-native-saf-x
 * @param {string} fileName - Name of the file (e.g., song.mp3)
 * @param {string} base64Data - Base64-encoded data
 */
export async function saveFile({ fileName, base64Data, path }) {
    try {
        // 1. Open Document Tree to pick a folder (user must give permission)
        console.warn(fileName)
        console.warn(base64Data.slice(0, 50)); // Log first 50 characters of the base64 string

        if (!path) {
            throw new Error('Failed to pick folder');
        }
        console.error(path)
        const fileUri = `${path}/${fileName}.mp3`;
        // 2. Create the file in the selected folder using createFile
        const createdFileUri = await createFile(fileUri, {
            mimeType: 'audio/mpeg',  // MIME type for MP3 file
            displayName: `${fileName}`,
        });

        if (!createdFileUri) {
            throw new Error('Failed to create file');
        }

        // 3. Convert base64 data to Buffer
        // const buffer = Buffer.from(base64Data, 'base64');
        // console.warn(Object.keys(buffer))
        // 4. Write the base64 data to the created file

        //const binaryBuffer = Buffer.from(base64Data).toString('base64')

        await writeFile(createdFileUri.uri, base64Data, { encoding: 'base64', mimeType: 'audio/mpeg' })
            .then(() => {
                console.warn('Audio file saved successfully!');
            })
            .catch((error) => {
                console.error('Error saving audio file:', error);
            });

        return createdFileUri;
    } catch (err) {
        console.error('saveFile error:', err);
        return null;
    }
}
