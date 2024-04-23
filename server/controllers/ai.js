import { decisionMakerByText } from '../AIModel/model.js';


class AIController  {
    async decisionMakerByText(req, res) {
        const text = req.body.text;
        const result = await decisionMakerByText(text);
        console.log(result); // Output the generated text
        res.send(result);
    }
}

export default AIController;