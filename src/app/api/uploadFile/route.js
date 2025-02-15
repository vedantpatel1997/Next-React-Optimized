import fs from 'fs';
import path from 'path';

export async function POST(request) {
    const storagePath = process.env.STORAGE_PATH || path.join(process.cwd(), 'home', 'site', 'wwwroot', 'next', 'storage');

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return Response.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Ensure the storage directory exists
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }

        // Save the file to the storage directory
        const filePath = path.join(storagePath, file.name);
        const fileData = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(fileData));

        return Response.json({ message: `File "${file.name}" uploaded successfully.` });
    } catch (err) {
        console.error('Error uploading file:', err); // Log the error
        return Response.json({ error: err.message }, { status: 500 });
    }
}