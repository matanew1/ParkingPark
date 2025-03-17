import mongoose from 'mongoose';

class OperationModel {
  #Operation;

  constructor() {
    this.#Operation = this.#defineSchema();
  }

  #defineSchema() {
    const operationSchema = new mongoose.Schema({
      endpoint: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }, {
      timestamps: true, // Automatically manages `createdAt` and `updatedAt`
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    });

    return mongoose.model('Operation', operationSchema);
  }

  getModel() {
    return this.#Operation;
  }
}

export default new OperationModel().getModel();
