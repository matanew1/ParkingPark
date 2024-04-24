import { initializeModel } from '../AIModel/model.js';

let decisionMakerByText;

initializeModel().then((model) => {
  decisionMakerByText = model.decisionMakerByText;
  // Now you can use decisionMakerByText
});


class AIController  {
    async decisionMakerByText(req, res) {
        const text = req.body.text;
        const result = await decisionMakerByText(text);
        console.log(result); // Output the generated text
        res.send(result);
    }
}

export default AIController;