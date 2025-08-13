import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// R2 uses S3-compatible API
const getR2Client = () => {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
};

export async function uploadToR2(siteName: string, content: string, metadata?: Record<string, string>) {
  const client = getR2Client();
  
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: `sites/${siteName}/content.md`,
    Body: content,
    ContentType: 'text/markdown',
    Metadata: {
      ...metadata,
      updatedAt: new Date().toISOString(),
    },
  });

  await client.send(command);
  
  // Return the URL where the site will be accessible
  return {
    success: true,
    url: `https://${siteName}.${process.env.DOMAIN || 'markdownsite.xyz'}`,
  };
}

export async function listSitesFromR2() {
  const client = getR2Client();
  
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME!,
    Prefix: 'sites/',
    Delimiter: '/',
  });

  const response = await client.send(command);
  const sites = [];

  if (response.CommonPrefixes) {
    for (const prefix of response.CommonPrefixes) {
      const siteName = prefix.Prefix?.replace('sites/', '').replace('/', '');
      if (siteName) {
        // Get metadata for each site
        const metaCommand = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: `sites/${siteName}/content.md`,
        });
        
        try {
          const metaResponse = await client.send(metaCommand);
          sites.push({
            name: siteName,
            url: `https://${siteName}.${process.env.DOMAIN || 'markdownsite.xyz'}`,
            updatedAt: metaResponse.Metadata?.updatedAt || new Date().toISOString(),
            size: metaResponse.ContentLength || 0,
          });
        } catch (error) {
          console.error(`Error fetching metadata for ${siteName}:`, error);
        }
      }
    }
  }

  return sites;
}

export async function deleteFromR2(siteName: string) {
  const client = getR2Client();
  
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: `sites/${siteName}/content.md`,
  });

  await client.send(command);
  
  return { success: true };
}

export async function getSiteContent(siteName: string) {
  const client = getR2Client();
  
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: `sites/${siteName}/content.md`,
  });

  try {
    const response = await client.send(command);
    const content = await response.Body?.transformToString();
    return content || null;
  } catch (error) {
    console.error(`Error fetching site ${siteName}:`, error);
    return null;
  }
}