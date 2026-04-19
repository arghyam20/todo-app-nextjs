const fs = require("fs");
const path = require("path");

const baseSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
`;

const modelsPath = path.join(__dirname, "..", "prisma", "models");
const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

if (!fs.existsSync(modelsPath)) {
  console.error("❌ Models directory not found");
  process.exit(1);
}

const files = fs.readdirSync(modelsPath);

let models = "";

files.forEach(file => {
  if (file.endsWith(".prisma")) {
    models += fs.readFileSync(path.join(modelsPath, file), "utf-8") + "\n";
  }
});

fs.writeFileSync(
  schemaPath,
  baseSchema + "\n" + models
);

console.log("✅ Prisma schema merged and generated successfully");
