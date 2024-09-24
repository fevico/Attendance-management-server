import { Model, model, ObjectId, Schema } from "mongoose";

interface AttendanceDoc{
    courseId: ObjectId
    courseName: string
    studentId: ObjectId
    studentName: string
    attendance: string
    attendedAt: Date
}

const attendanceSchema = new Schema<AttendanceDoc>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseName: { type: String, required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String, required: true },
    attendance: { type: String, enum: ['Present', 'Absent'], default: "Absent",}, // true for present, false for absent
    attendedAt: { type: Date, default: Date.now }
}, {timestamps: true})

const attendanceModel = model("Attendance", attendanceSchema) as Model<AttendanceDoc>
export default attendanceModel