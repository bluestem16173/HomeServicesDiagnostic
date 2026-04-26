import { generateHsdPage } from './prompts/generateHsdPage';

async function runTest() {
  const testSlug = "/hvac/ac-not-cooling/fort-myers-fl";
  
  // Extract parts for the generator
  const vertical = "hvac";
  const symptom = "ac not cooling";
  const city = "Fort Myers, FL";

  try {
    console.log("Starting test generation for:", testSlug);
    const page = await generateHsdPage({ vertical, symptom, city });
    console.log("\n✅ TEST OUTPUT SUCCESS:");
    console.log(JSON.stringify(page, null, 2));
  } catch (error) {
    console.error("❌ TEST FAILED:");
    console.error(error);
  }
}

runTest();
