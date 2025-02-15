import fs from 'fs';
import path from 'path';

export async function POST(request) {
    const storagePath = process.env.STORAGE_PATH || path.join(process.cwd(), 'home', 'site', 'wwwroot', 'next', 'storage');

    try {
        const { fileName } = await request.json();

        if (!fileName) {
            return Response.json({ error: 'File name is required' }, { status: 400 });
        }

        const filePath = path.join(storagePath, fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return Response.json({ error: 'File does not exist' }, { status: 404 });
        }

        // Delete the file
        fs.unlinkSync(filePath);
        return Response.json({ message: `File "${fileName}" deleted successfully.` });
    } catch (err) {
        console.error('Error deleting file:', err); // Log the error
        return Response.json({ error: err.message }, { status: 500 });
    }
}