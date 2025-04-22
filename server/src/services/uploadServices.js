const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const uploadImage = async (file, folder = "recipes") => {
  try {
    if (!file) {
      console.error("File is undefined or null");
      return "/placeholder-recipe.jpg";
    }

    console.log("Uploading file:", file.name);
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    console.log("Uploading to Supabase path:", fileName);
    const { data, error } = await supabase.storage
      .from("image")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw error;
    }

    console.log("Upload successful, getting public URL");
    // Get public URL
    const { data: urlData } = supabase.storage
      .from("image")
      .getPublicUrl(fileName);

    console.log("Public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = {
  uploadImage,
};
