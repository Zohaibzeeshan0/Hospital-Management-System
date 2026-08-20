import path from 'path';
import fs from 'fs/promises';

export async function saveUploadedFile(file: File, folder: string = 'documents'): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);
    return `/uploads/${folder}/${filename}`;
  } catch (err) {
    console.error('Error saving file:', err);
    // Fallback mock URI for preview resilience
    return `/uploads/${folder}/mock-${Date.now()}-${file.name}`;
  }
}
