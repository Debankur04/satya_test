import { PrismaClient } from "@prisma/client";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";

const prisma = new PrismaClient();
const firestore = getFirestore();

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: "User ID is required" });

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { reports: true, quizScores: true },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { userId, name, email, profilePicture } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email, profilePicture },
      });

      res.status(200).json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
