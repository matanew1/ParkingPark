// textGenerationService.mjs
import fetch from "isomorphic-fetch";
import { pipeline } from "@xenova/transformers";
import { env } from '@xenova/transformers';
import { createRequire } from "module";
import {dirname} from 'path';



env.allowRemoteModels = false;
env.allowLocalModels = true;
env.allowCache = true;
env.localModelPath = dirname(import.meta.url).replace('%D7%9E%D7%AA%D7%9F', 'מתן').replace('file:///', '');
// env.localModelPath = "C:/Users/מתן/Desktop/ParkingPark/server/AIModel/";
env.cacheDir = "./cache";

let decisionMaker;

console.log("Loading models...");


const loadModels = async () => {
  try {
    const decisionMakerModel = await pipeline("text2text-generation", "LaMini-Flan-T5-783M");
    decisionMaker = decisionMakerModel;

    console.log("Models loaded successfully");
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
      console.log("Decision maker not loaded. Loading now...");
      await loadModels();
      if (!decisionMaker) {
        throw new Error("Failed to load decision maker");
      }
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
