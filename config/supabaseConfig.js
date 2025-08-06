const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucketIfNotExists(bucketName) {
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true, // or false, depending on your needs
    });

    if (error && error.message === "The bucket already exists") {
      console.log(`Bucket "${bucketName}" already exists.`);
    } else if (error) {
      console.error("Error creating bucket:", error.message);
    } else {
      console.log(`Bucket "${bucketName}" created successfully.`);
    }
  } catch (err) {
    console.error("Unexpected error during bucket creation:", err.message);
  }
}

async function checkIfAuthenticated() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error.message);
    return false;
  }

  if (user) {
    console.log('User is authenticated:', user.id);
    return true;
  } else {
    console.log('User is not authenticated.');
    return false;
  }
}

module.exports = {
  supabase,
  createBucketIfNotExists,
  checkIfAuthenticated,
};
