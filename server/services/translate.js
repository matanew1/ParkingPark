import axios from 'axios';

class TranslateService {
  #options;

  constructor() {
    this.#options = {
      method: 'POST',
      url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'ba9db486c2mshfb41a38e3df0e0bp17b111jsn91f3d03974c7',
        'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
      },
      data: {},
    };
  }

  async translateText(text, to) {
    this.#options.data = {
      source: "he",
      target: "en",
      q: text
    };
    try {
      const response = await axios.request(this.#options);
      return response.data.data.translations.translatedText;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default TranslateService;