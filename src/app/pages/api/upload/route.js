import { storage } from "../../../lib/firebase";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { file, fileType } = request.json();
    if (!file) return NextResponse.json({ status:400,error: "No file provided" });

    const fileName = `${uuidv4()}.${fileType}`;
    const fileRef = storage.file(fileName);
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: "03-09-2099" });

    NextResponse.json({status:200, fileUrl: url });
  } catch (error) {
    NextResponse.json({status:400, error: error.message });
  }
}
