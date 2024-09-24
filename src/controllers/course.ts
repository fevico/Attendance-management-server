import { RequestHandler } from "express";
import QRCode from "qrcode";
import authModel from "src/model/auth";
import courseModel, { CourseDocument } from "src/model/course";
import registrationModel from 'src/model/registration'; // Adjust path accordingly

export const createCourse: RequestHandler = async (req, res) => {
    const { name, unit, code, credits, startTime, endTime } = req.body;
    //  const lecturerId = req.user.id;

    try {
        // Check if startTime and endTime are provided
        // if (!startTime || !endTime) {
        //     return res.status(400).json({ message: "Start time and end time are required" });
        // }

        // Get the current date to combine with the time from the frontend
        const currentDate = new Date().toISOString().split('T')[0]; // e.g., '2024-09-23'

        // Combine the date with the startTime and endTime received from the frontend
        const fullStartTime = new Date(`${currentDate}T${startTime}:00.000Z`); // e.g., '2024-09-23T14:30:00.000Z'
        const fullEndTime = new Date(`${currentDate}T${endTime}:00.000Z`);     // e.g., '2024-09-23T16:30:00.000Z'

        // Create a new course in the database
        const newCourse = new courseModel({
            name,
            code,
            unit,
            credits,
            // startTime: fullStartTime, // Store the full Date object
            // endTime: fullEndTime,
            //  lecturerId
        });

        // Generate QR code data
        const qrData = `https://attendance-management-server-g57k.onrender.com/attendance?courseId=${newCourse._id}&courseName=${name}&courseCode=${code}`;
        newCourse.qrCode = qrData;

        // Save the course to the database
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
        console.log(error)
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
    const now = new Date(); // Current time (local or UTC)

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

        // Filter courses based on original startTime and endTime in UTC
        const filteredCourses = courses.filter(course => {
            const startTimeUTC = new Date(course.startTime).getTime();  // Convert start time to UTC timestamp
            const endTimeUTC = new Date(course.endTime).getTime();      // Convert end time to UTC timestamp
            const currentTimeUTC = new Date(now.toISOString()).getTime();  // Convert current time to UTC timestamp

            // Ensure current time is between startTime and endTime
            return currentTimeUTC >= startTimeUTC && currentTimeUTC <= endTimeUTC;
        });

        // If no active courses found within the original time range
        if (filteredCourses.length === 0) {
            return res.status(404).json({ message: "No active courses found within the time range for this student" });
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
