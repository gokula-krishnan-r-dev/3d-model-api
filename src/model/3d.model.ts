import mongoose, { Document, Schema } from "mongoose";

interface IModel extends Document {
  name: string;
  threeDModelPath: string;
}

const ModelSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    threeDModelPath: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model<IModel>("Model", ModelSchema);

export default Model;
export { IModel };
