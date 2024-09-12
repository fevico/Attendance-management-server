import { Schema, model, ObjectId } from "mongoose";
import { CourseDocument } from "./course";

interface RegistrationDocument extends Document {
    studentId: ObjectId;
    courseId: CourseDocument;
    attendanceMarked: boolean; // To track if attendance is marked
    attendedAt?: Date; // Optional, time of attendance
}

const registrationSchema = new Schema<RegistrationDocument>({
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    attendanceMarked: { type: Boolean, default: false },
    attendedAt: { type: Date }, // Optional field to store the time of attendance
}, { timestamps: true });

const registrationModel = model<RegistrationDocument>('Registration', registrationSchema);

export default registrationModel;
