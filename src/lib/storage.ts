/**
 * Document files in an S3-compatible bucket (MinIO, Garage, R2, AWS…).
 *
 * The bucket is private and only this server talks to it: uploads arrive at
 * PUT /api/documents/[id]/file and reads go out through GET on the same
 * route, each after an RLS-checked lookup of the document row. That keeps
 * the bucket off the public internet, needs no CORS configuration, and puts
 * the size and type limits in code the app controls.
 *
 * Path-style addressing is the default because self-hosted stores rarely
 * have wildcard DNS for virtual-hosted buckets; set S3_FORCE_PATH_STYLE=false
 * for AWS.
 */

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

let client: S3Client | null = null;

function s3(): S3Client {
  if (client) return client;
  client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || "us-east-1",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });
  return client;
}

function bucket(): string {
  const name = process.env.S3_BUCKET;
  if (!name) throw new Error("S3_BUCKET is not set.");
  return name;
}

export async function putFile(
  key: string,
  body: Uint8Array,
  contentType: string
): Promise<void> {
  const put = () =>
    s3().send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: body.byteLength,
      })
    );

  try {
    await put();
  } catch (err) {
    // A fresh store has no bucket yet. Creating it on the first upload
    // spares every deployment a separate provisioning step; credentials
    // scoped to an existing bucket never reach this branch.
    if ((err as { name?: string }).name !== "NoSuchBucket") throw err;
    await s3().send(new CreateBucketCommand({ Bucket: bucket() })).catch((e) => {
      // Two first uploads at once: the other one made it.
      const name = (e as { name?: string }).name;
      if (name !== "BucketAlreadyOwnedByYou" && name !== "BucketAlreadyExists") throw e;
    });
    await put();
  }
}

/** The whole object in memory — documents are capped at 25 MiB. */
export async function getFileBytes(key: string): Promise<Uint8Array> {
  const result = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  if (!result.Body) throw new Error(`Empty body for ${key}`);
  return result.Body.transformToByteArray();
}

/** The object as a web stream, for handing straight to a Response. */
export async function getFileStream(
  key: string
): Promise<{ body: ReadableStream; length: number | undefined }> {
  const result = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  if (!result.Body) throw new Error(`Empty body for ${key}`);
  return {
    body: result.Body.transformToWebStream(),
    length: result.ContentLength,
  };
}

/** Deleting a key that is already gone succeeds, as S3 does. */
export async function deleteFile(key: string): Promise<void> {
  await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
}
