import fs from "fs";
import path from "path";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../src/config/firebaseConfig";

const dataPath = path.join(process.cwd(), "src/assets/data");

const categoryFolders = [
  "expo",
  "git",
  "javascript",
  "nodejs",
  "python",
  "reactNativeCli",
  "redux",
  "typescript",
];

const uploadData = async () => {
  try {
    // 1. Upload categories
    const categoriesPath = path.join(dataPath, "categories.json");
    const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));

    for (const category of categories) {
      await setDoc(doc(db, "categories", category.id), category);
    }

    console.log("✅ All categories uploaded!");

    // 2. Upload topics and lessons
    for (const folder of categoryFolders) {
      const folderPath = path.join(dataPath, folder);

      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".json"));

      // Find topics file
      const topicsFile = files.find((file) =>
        file.toLowerCase().includes("topics"),
      );

      if (!topicsFile) {
        console.log(`⚠️ No topics file found in ${folder}`);
        continue;
      }

      const topicsPath = path.join(folderPath, topicsFile);
      const topics = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));

      // 3. Upload topics
      for (const topic of topics) {
        await setDoc(doc(db, "topics", topic.id), {
          ...topic,
          categoryId: getCategoryId(folder),
        });
      }

      console.log(`✅ ${folder} topics uploaded!`);

      // 4. Upload lessons
      const lessonFiles = files.filter(
        (file) => !file.toLowerCase().includes("topics"),
      );

      for (const lessonFile of lessonFiles) {
        const lessonPath = path.join(folderPath, lessonFile);

        const lessons = JSON.parse(fs.readFileSync(lessonPath, "utf-8"));

        for (const lesson of lessons) {
          await setDoc(doc(db, "lessons", lesson.id), lesson);
        }

        console.log(`   📚 ${lessonFile} uploaded!`);
      }
    }

    console.log("\n🎉 ALL DATA UPLOADED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ Upload failed:", error);
  }
};

const getCategoryId = (folder: string) => {
  const categoryMap: Record<string, string> = {
    reactNativeCli: "react-native",
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    nodejs: "nodejs",
    redux: "redux",
    expo: "expo",
    git: "git",
  };

  return categoryMap[folder];
};

uploadData();
