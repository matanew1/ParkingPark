// textGenerationService.mjs
import fetch from "isomorphic-fetch";
import { pipeline } from "@xenova/transformers";

let translator;
let decisionMaker;

const loadModels = async () => {
  try {
    const [translatorModel, decisionMakerModel] = await Promise.all([
      pipeline("translation", "Xenova/m2m100_418M"),
      pipeline("text2text-generation", "Xenova/LaMini-Flan-T5-783M"),
    ]);

    translator = translatorModel;
    decisionMaker = decisionMakerModel;
  } catch (error) {
    console.error("Error loading models:", error);
  }
};

console.log("Loading models...");
loadModels().then(() => {
  console.log("---------------Models loaded----------------");
});

const translationCache = new Map();
const decisionCache = new Map();


const translateText = async (text) => {
  try {
    if (!translator) {
      throw new Error("Translator not loaded");
    }

    // Check if the translation is in the cache
    if (translationCache.has(text)) {
      return translationCache.get(text);
    }

    const translation = await translator(text, {
      src_lang: "he",
      tgt_lang: "en",
    });

    // Store the translation in the cache
    translationCache.set(text, translation);

    return translation;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};

// Generate text based on the input text
const decisionMakerByText = async (text) => {
  try {
    if (!decisionMaker) {
      throw new Error("Decision maker not loaded");
    }

    // Check if the decision is in the cache
    if (decisionCache.has(text)) {
      return decisionCache.get(text);
    }

    const decision = await decisionMaker(text, {
      max_length: 50, // Maximum length of the generated text
      num_return_sequences: 1, // Number of different sequences to generate
      do_sample: true, // To enable sampling
    });

    // Store the decision in the cache
    decisionCache.set(text, decision);

    return decision;
  } catch (error) {
    console.error("Error generating text:", error);
    return null;
  }
};

// Export the functions for external use
export { loadModels, decisionMakerByText, translateText };
