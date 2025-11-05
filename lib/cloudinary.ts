import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: any;
}

export async function uploadImage(
  file: Buffer | string,
  folder: string = 'cius'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file.toString('base64'), {
      folder,
      resource_type: 'auto',
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error,
    };
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export async function getImageUrl(publicId: string, transformations?: any): Promise<string> {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
}

export default cloudinary;
