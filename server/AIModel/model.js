// textGenerationService.mjs
import fetch from "isomorphic-fetch";
import { pipeline } from "@xenova/transformers";

let decisionMaker;

console.log("Loading models...");
const loadModels = async () => {
  try {
    const decisionMakerModel = await pipeline(
        "text2text-generation",
        "Xenova/LaMini-Flan-T5-783M"
      ),
      decisionMaker = decisionMakerModel;
  } catch (error) {
    console.error("Error loading models:", error);
  }
};
loadModels().then(() => {
  console.log("---------------Models loaded----------------");
});

// Generate text based on the input text
const decisionMakerByText = async (text) => {
  try {
    if (!decisionMaker) {
      throw new Error("Decision maker not loaded");
    }

    const decision = await decisionMaker(text, {
      max_length: 300,
      num_return_sequences: 3,
      do_sample: true,
      temperature: 0.7,
      top_k: 60,
      top_p: 0.98,
    });
    return decision;
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
};

// Export the functions for external use
export { decisionMakerByText };
