import HistoryOperationService from "../services/history.js";

class HistoryOperationController {

    #historyOperationService;

    constructor() {
        this.#historyOperationService = new HistoryOperationService();
    }

    getAllHistoryOperation = async (req, res) => {
        try {
            const operations = await this.#historyOperationService.getAllHistoryOperation();

            if (operations.length > 0) {
                res.status(200).json(operations);
            } else {
                res.status(404).json({ message: "No operations found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    deleteAllHistoryOperation = async (req, res) => {
        try {
            const result = await this.#historyOperationService.deleteAllHistoryOperation();

            if (result) {
                res.status(204).json({ message: "All operations deleted" });
            } else {
                res.status(404).json({ message: "No operations found" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default HistoryOperationController;