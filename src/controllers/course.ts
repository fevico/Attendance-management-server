import { RequestHandler } from "express";
import QRCode from "qrcode";
import authModel from "src/model/auth";
import courseModel, { CourseDocument } from "src/model/course";
import registrationModel from 'src/model/registration'; // Adjust path accordingly

export const createCourse: RequestHandler = async (req, res) => {
    const { name, unit, code, credits, startTime, endTime } = req.body;

    try {
        // Create a new course in the database
        const newCourse = new courseModel({
            name,
            code,
            unit,
            credits,
            startTime,
            endTime,
            // duration: courseDuration,
            // lecturerId: courseLecturer,
        });

        // Save the course to the database

        // Generate QR code data
        const qrData = `https://attendance-management-server-g57k.onrender.com/attendance?courseId=${newCourse._id}&lecturerId=${code}&courseName=${name}&courseCode=${code}`;
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

export const getAllCourses: RequestHandler = async (req, res) => {
    try {
        const course = await courseModel.find();
        if(!course || course.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
         res.json({course});
    } catch (error) {
        res.status(500).json({ message: 'Error getting courses', error });
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


export const registerCourse: RequestHandler = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.id

    try {
        const course = await courseModel.findById(courseId);
        const student = await authModel.findById(studentId);

        if (!course || !student) {
            return res.status(404).json({ message: 'Course or student not found' });
        }
        await registrationModel.create({ studentId, courseId, studentName: student.name, courseName: course.name });
        res.status(201).json({ message: 'Course registered successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error registering course', error });
    }
}
