// textGenerationService.js

let pipeline;
let translator;
let decisionMaker;

// Load the pipeline dynamically
const loadModel = async () => {
  try {
    const module = await import("@xenova/transformers");
    pipeline = module.pipeline;
  } catch (error) {
    console.error("Error loading model:", error);
  }
};
const loadTranslator = async () => {
  try {
    translator = await pipeline("translation", "Xenova/m2m100_418M");
  } catch (error) {
    console.error("Error loading model:", error);
  }
};
const loadDecisionMaker = async () => {
  try {
    decisionMaker = await pipeline(
      "text2text-generation",
      "Xenova/LaMini-Flan-T5-783M"
    );
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

// Translate text from Hebrew to English
const translateText = async (text) => {
  try {
    if (!pipeline) {
      throw new Error("Pipeline not loaded");
    }
    return await translator(text, { src_lang: "he", tgt_lang: "en" });
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};
// Generate text based on the input text
const decisionMakerByText = async (text) => {
  try {
    if (!pipeline) {
      throw new Error("Pipeline not loaded");
    }
    return await decisionMaker(text, {
      max_length: 50, // Maximum length of the generated text
      num_return_sequences: 1, // Number of different sequences to generate
      do_sample: true, // To enable sampling
    });
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
};

// Export the initializeTextGeneration function for external use
module.exports = {
  decisionMakerByText,
  loadDecisionMaker,
  loadTranslator,
  translateText,
  loadModel,
};
