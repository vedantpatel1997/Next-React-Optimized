import fs from 'fs';
import path from 'path';

export async function GET() {
    // Use the correct mounted storage path
    const storagePath = process.env.STORAGE_PATH || path.join(process.cwd(), 'home', 'site', 'wwwroot', 'next', 'storage');

    try {
        // Check if the directory exists
        if (!fs.existsSync(storagePath)) {
            return Response.json({ error: 'Storage directory does not exist' }, { status: 404 });
        }
        console.log(storagePath);
        
        // List files in the directory
        const files = fs.readdirSync(storagePath);
        return Response.json({ files });
    } catch (err) {
        console.error('Error listing files:', err); // Log the error
        return Response.json({ error: err.message }, { status: 500 });
    }
}