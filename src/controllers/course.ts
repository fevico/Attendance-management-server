import { RequestHandler } from "express";
import QRCode from "qrcode";
import courseModel, { CourseDocument } from "src/model/course";
import registrationModel from 'src/model/registration'; // Adjust path accordingly

export const createCourse: RequestHandler = async (req, res) => {
    const { name, unit, code, credits } = req.body;

    try {
        // Create a new course in the database
        const newCourse = new courseModel({
            name,
            code,
            unit,
            credits,
            // duration: courseDuration,
            // lecturerId: courseLecturer,
        });

        // Save the course to the database

        // Generate QR code data
        // const qrData = `http://yourapp.com/attendance?courseId=${newCourse._id}&lecturerId=${courseLecturer}&courseName=${courseName}&courseCode=${courseCode}`;
        const qrData = `http://localhost:3002/attendance?courseId=${newCourse._id}&lecturerId=${code}&courseName=${name}&courseCode=${code}`;
        newCourse.qrCode = qrData;

        await newCourse.save();

        // Generate the QR code
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        // Respond with the course details and the QR code
        res.status(201).json({
            message: 'Course created successfully',
            course: newCourse,
            qrCode: qrCodeUrl,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error });
    }
};


export const getCourse: RequestHandler = async (req, res) => {
    const courseId = req.params.id;

    try {
        // Find the course by ID
        const course = await courseModel.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Respond with the course details
        res.json(course);
    } catch (error) {       
        res.status(500).json({ message: 'Error getting course', error });
    }
}

// Route for student to see courses and QR codes
// export const getStudentCourses: RequestHandler = async (req, res) => {
//     const studentId = req.user.id; // Assuming user authentication
//     const now = new Date();

//     try {
//         // Find the courses the student is registered for within the valid time window
//         const courses = await courseModel.find({
//             'students': studentId, // Assuming `students` is an array of student IDs
//             'startTime': {
//                 $gte: new Date(now.getTime() - 15 * 60000), // 15 mins before
//                 $lte: new Date(now.getTime() + 15 * 60000)  // 15 mins after
//                             }
//         });

//         if (courses.length === 0) {
//             return res.status(404).json({ message: 'No courses available at this time' });
//         }

//         // Fetch and generate QR codes for the courses
//         const courseWithQRs = await Promise.all(
//             courses.map(async (course) => {
//                 const qrCode = await QRCode.toDataURL(course.qrCode);
//                 return { ...course.toObject(), qrCode }; // toObject() to return a plain object
//             })
//         );

//         res.json(courseWithQRs);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching student courses', error });
//     }
// }


export const getStudentCourses: RequestHandler = async (req, res) => {
    const studentId = req.user.id; // Assuming authentication provides this
    const now = new Date();

    try {
        // Fetch registrations for the student and populate course details
        const registrations = await registrationModel.find({ studentId })
        .populate('courseId') as { courseId: CourseDocument }[]; // Ensure this populates the course details

        // If no registrations found
        if (!registrations.length) {
            return res.status(404).json({ message: "No registrations found for this student" });
        }

        // Extract the courses from the registrations
        const courses = registrations.map(registration => registration.courseId);

        // Define time ranges for filtering
        const fifteenMinutesBefore = new Date(now.getTime() - 15 * 60000); // 15 minutes before current time
        const tenMinutesAfter = new Date(now.getTime() + 10 * 60000); // 10 minutes after current time

        // Filter courses based on the time range
        const filteredCourses = courses.filter(course => {
            return now >= new Date(course.startTime.getTime() - 15 * 60000) && // 15 minutes before start time
                   now <= new Date(course.startTime.getTime() + 10 * 60000); // 10 minutes after start time
        });

        // If no upcoming courses found
        if (filteredCourses.length === 0) {
            return res.status(404).json({ message: "No courses found within the time range for this student" });
        }

        // Return filtered courses
        res.json(filteredCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
};



// Route for marking attendance
// export const markAttendance: RequestHandler = async (req, res) => {
//     const { courseId } = req.query;
//     const studentId = req.query.studentId as string; // Ensure it's treated as a string


//     try {
//         // Verify if the student is registered for the course
//         const course = await courseModel.findById(courseId);

//         const studentObjectId = new Types.ObjectId(studentId);


//         if (!course || !course.students.some(student => student.equals(studentObjectId))) {
//             return res.status(400).json({ message: "Student not registered for this course" });
//         }
        
//         // Verify the time of attendance
//         const now = new Date();
//         if (now < course.startTime || now > course.endTime) {
//             return res.status(400).json({ message: "Attendance time not valid" });
//         }

//         // Assuming there's an attendance schema or subdocument inside the course model
//         course.attendance.push({ studentId, attendedAt: now });
//         await course.save();

//         res.json({ message: "Attendance marked successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error marking attendance", error });
//     }
// };


export const markAttendance : RequestHandler = async (req, res) => {
    const { courseId, studentId } = req.query;

    try {
        // Find the registration record
        const registration = await registrationModel.findOne({
            studentId,
            courseId
        });

        // Check if registration exists
        if (!registration) {
            return res.status(400).json({ message: "Student not registered for this course" });
        }

        // Check if attendance is already marked
        if (registration.attendanceMarked) {
            return res.status(400).json({ message: "Attendance already marked for this course" });
        }

        // Mark attendance
        registration.attendanceMarked = true;
        registration.attendedAt = new Date();

        // Save updated registration
        await registration.save();

        res.json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error marking attendance', error });
    }
};

