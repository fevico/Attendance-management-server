import { RequestHandler } from "express";
import attendanceModel from "src/model/attendance";
import authModel from "src/model/auth";
import courseModel from "src/model/course";
import registrationModel from "src/model/registration";

export const markAttendance: RequestHandler = async (req, res) => {
    const { courseId } = req.query;
    const studentId = req.user.id

    try {
        const student = await authModel.findById(studentId);
        if(!student) return res.status(400).json({ message: "Student not found" });
        // Find the registration record
        const registration = await registrationModel.findOne({
            studentId,
            courseId
        });

        // Check if registration exists
        if (!registration) {
            return res.status(400).json({ message: "Student not registered for this course" });
        }

        // Check if attendance is already marked for the day
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight to only compare the date

        const attendanceExists = await attendanceModel.findOne({
            studentId,
            courseId,
            attendedAt: { $gte: today } // Check if attendance exists for today
        });

        if (attendanceExists) {
            return res.status(400).json({ message: "Attendance already marked for today" });
        }

        // Mark attendance (create a new attendance document)
        const newAttendance = new attendanceModel({
            studentId,
            courseId,
            studentName: registration.studentName,
            courseName: registration.courseName,
            regNumber: student.regNumber
        });

        await newAttendance.save();

        res.json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error });
    }
};


export const getLecturerAttendance: RequestHandler = async (req, res) => {
    const lecturerId = req.user.id;
    const user = await authModel.findById(lecturerId);
    if (!user || user.role !== 'lecturer') return res.status(400).json({ message: 'Lecturer not found' });
    try {
        const course = await courseModel.findOne({ lecturerId });
        if(!course) return res.status(400).json("No course found for this lecturer")
        const attendance = await attendanceModel.find({ courseId: course._id });
        if(!attendance) return res.status(400).json({ message: 'Attendance not found' });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Error getting attendance', error });
    }
}