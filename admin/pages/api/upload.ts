
import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { Fields, Files, File as FormidableFile } from 'formidable';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  // Helper function to parse form data
  const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = formidable(); // Updated usage
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
  };
  
  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        // Parse the form data
        const { files } = await parseForm(req);
        const file = files.file as FormidableFile | FormidableFile[];
  
        // Handle if the file is an array
        const actualFile = Array.isArray(file) ? file[0] : file;
  
        if (!actualFile) {
          return res.status(400).json({ message: 'No file provided' });
        }
  
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(actualFile.filepath, {
          resource_type: 'video',
          folder: 'videos',
        });
  
        return res.status(200).json({ url: result.secure_url });
      } catch (error: any) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ message: 'Upload failed', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }