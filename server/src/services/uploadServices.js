const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadImage = async (file, folder = "recipes") => {
  try {
    const fileName = `${folder}/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from("image")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: url } = supabase.storage.from("image").getPublicUrl(fileName);
    return url.publicUrl;
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};

module.exports = {
  uploadImage,
};
