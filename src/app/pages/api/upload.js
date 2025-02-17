import { storage } from "../../../lib/firebase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { file, fileType } = req.body;
    if (!file) return res.status(400).json({ error: "No file provided" });

    const fileName = `${uuidv4()}.${fileType}`;
    const fileRef = storage.file(fileName);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: "03-09-2099" });

    res.status(200).json({ fileUrl: url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
