import { createFile, writeFile } from 'react-native-saf-x';

export async function saveBase64AsMp3ToSAF(
    folderUri,
    base64Data
) {
    try {
        // Create a new file in the SAF folder
        const fileUri = await createFile(folderUri, filename, 'audio/mpeg');

        // Write the base64 data to the file
        await writeFile(fileUri, base64Data, 'base64');

        console.log('MP3 file saved at:', fileUri);
        return fileUri; // You can return the full URI of the saved file
    } catch (error) {
        console.error('Error saving file in SAF:', error);
        return null;
    }
}
