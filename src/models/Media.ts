import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

MediaSchema.index({ mimeType: 1 });
MediaSchema.index({ uploadedBy: 1 });
MediaSchema.index({ createdAt: -1 });

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);