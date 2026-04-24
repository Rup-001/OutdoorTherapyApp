const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
  region: config.storage.s3.region,
  credentials: {
    accessKeyId: config.storage.s3.accessKey,
    secretAccessKey: config.storage.s3.secretKey,
  },
  endpoint: config.storage.s3.endpoint,
  forcePathStyle: true,
});

/**
 * Delete a file from local storage or R2/S3
 * @param {string} key - File key or local path
 */
const deleteFile = async (key) => {
  if (!key) return;

  if (config.storage.mode === 'local') {
    // Determine the actual path on disk
    const filePath = path.join(__dirname, '../../', key);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete local file: ${filePath}`, err);
      }
    }
    return;
  }

  // R2/S3 Delete
  const command = new DeleteObjectCommand({
    Bucket: config.storage.s3.bucket,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from R2:', error);
  }
};

/**
 * Generate a signed URL for a private R2/S3 object
 * @param {string} key - File key in the bucket
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string>}
 */
const getSignedFileUrl = async (key, expiresIn = 3600) => {
  if (!key) return null;
  
  // If storage mode is local, return the local URL with BASE_URL support
  if (config.storage.mode === 'local') {
    let baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    // Remove trailing slash from baseUrl
    baseUrl = baseUrl.replace(/\/+$/, "");
    
    // Clean the key: replace backslashes with forward slashes and remove leading/double slashes
    let cleanKey = key.replace(/\\/g, '/').replace(/\/+/g, '/');
    if (!cleanKey.startsWith('/')) {
      cleanKey = '/' + cleanKey;
    }
    
    return `${baseUrl}${cleanKey}`;
  }

  const command = new GetObjectCommand({
    Bucket: config.storage.s3.bucket,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

module.exports = {
  getSignedFileUrl,
  deleteFile,
};
