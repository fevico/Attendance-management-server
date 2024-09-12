import { model, Model, ObjectId, Schema } from "mongoose";

export interface CourseDocument{
    name: string;
    code: string;
    credits: number;
    students: ObjectId[];
    lecturerId: ObjectId;
    qrCode: string
    startTime: Date;
    endTime: Date;
}

const course = new Schema <CourseDocument>({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    students: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
    },    
    lecturerId: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    qrCode: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, {timestamps: true})

const courseModel = model('Course', course);

export default courseModel;
