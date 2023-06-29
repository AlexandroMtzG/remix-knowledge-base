import { createClient } from "@supabase/supabase-js";

function getClient() {
  const supabaseUrl = process.env.SUPABASE_API_URL?.toString() ?? "";
  const supabaseKey = process.env.SUPABASE_KEY?.toString() ?? "";
  return createClient(supabaseUrl, supabaseKey);
}

async function createSupabaseFile(
  bucketId: string,
  path: string,
  file: File | ReadableStream<Uint8Array> | "",
  contentType?: string
): Promise<{
  id: string;
  publicUrl: string | null;
}> {
  const client = getClient();
  const bucket = await getOrCreateSupabaseBucket(bucketId, true);
  if (!bucket.data) {
    if (bucket.error) {
      throw Error("Could not create supabase bucket: " + bucket.error.message);
    } else {
      throw Error("Could not create supabase bucket: Unknown error");
    }
  }

  const createdSupabaseFile = await client.storage.from(bucket.data.id).upload(path, file, {
    contentType,
  });
  if (!createdSupabaseFile.data) {
    if (createdSupabaseFile.error) {
      throw Error("Could not create supabase file: " + JSON.stringify({ error: createdSupabaseFile.error.message, path }));
    } else {
      throw Error("Could not create supabase file: Unknown error");
    }
  }

  return {
    id: createdSupabaseFile.data.path,
    publicUrl: await getSupabaseFilePublicUrl(bucketId, path),
  };
}

async function getOrCreateSupabaseBucket(id: string, isPublic: boolean) {
  const client = getClient();

  const existingBucket = await client.storage.getBucket(id);
  if (existingBucket.data) {
    return {
      data: existingBucket.data,
      error: existingBucket.error,
    };
  }
  const newBucketId = await client.storage.createBucket(id, {
    public: isPublic,
  });
  if (newBucketId.data) {
    const newBucket = await client.storage.getBucket(newBucketId.data.name);
    if (newBucket.data) {
      return {
        data: newBucket.data,
        error: newBucket.error,
      };
    }
  }
  return {
    data: null,
    error: newBucketId.error,
  };
}

async function getSupabaseFilePublicUrl(bucketId: string, path: string): Promise<string | null> {
  const client = getClient();

  const supabaseFile = client.storage.from(bucketId).getPublicUrl(path);
  if (!supabaseFile.data.publicUrl) {
    throw Error("Could not get supabase file: Unknown error");
  }
  return supabaseFile.data.publicUrl;
}

export default {
  createSupabaseFile,
};
