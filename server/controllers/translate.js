import TranslateService from "../services/translate.js";

class TranslateController {
  static async translateText(req, res) {
    const { text, to } = req.body;
    const translateService = new TranslateService();
    try {
      const translatedText = await translateService.translateText(
        text,
        to
      );
      res.status(200).json({ translatedText });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default TranslateController;
