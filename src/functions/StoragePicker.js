import { openDocumentTree, hasPermission, getPersistedUriPermissions, listFiles } from 'react-native-saf-x';

/**
 * Handles folder selection with better error handling
 */
export async function folderPicker() {
    try {
        const options = {
            initial: undefined // Don't try to open any predefined folder
        };
        console.warn('Starting folder selection process...');

        // Open the document tree picker with better error handling
        const doc = await openDocumentTree(true)
            .catch(error => {
                console.error('Document tree picker error:', error);
                return null;
            });
        console.warn(doc)
        if (!doc) {
            console.warn('No document returned from picker');
            return null;
        }

        if (!doc.uri) {
            console.warn('Document selected but has no URI');
            return null;
        }
        const files = await listFiles(doc.uri);
        console.warn(files)
        files.forEach(file => {
            console.warn(`Name: ${file.name}, Mime: ${file.mime}, URI: ${file.uri}`);
        });
        // SAF automatically grants temporary access; persist it manually if needed.
        const granted = await hasPermission(doc.uri);

        if (granted) {
            // You can optionally check persisted permissions later:
            const persisted = await getPersistedUriPermissions();
            console.warn("Persisted URIs:", persisted);
        }


        const selectedUri = doc.uri;
        console.warn('Successfully selected folder with URI:', selectedUri);

        // No need to check existence or create directory
        // The selected URI is already a valid directory

        return selectedUri;
    } catch (err) {
        console.error('Uncaught error in folderPicker:', err);
        return null;
    }
}