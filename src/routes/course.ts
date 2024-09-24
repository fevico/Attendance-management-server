import { Router } from "express";
import { createCourse, getAllCourses, getStudentCourses, registerCourse } from "src/controllers/course";
import { mustAuth } from "src/middleware/auth";

const courseRouter = Router()

courseRouter.post('/create', mustAuth, createCourse)
courseRouter.get('/student/courses', mustAuth, getStudentCourses)
courseRouter.post('/student/course/registration', mustAuth, registerCourse)
courseRouter.get('/courses', getAllCourses)

export default courseRouter;

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Api endpoint to manage Course
 */

/**
 * @swagger
 * /course/create:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - credits
 *               - startTime
 *               - endTime
 *             properties:
 *               name:
 *                 type: string
 *                 example: Calculus I
 *               code:
 *                 type: string
 *                 example: MATH121
 *               credits:
 *                 type: number
 *                 example: 5
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-09-01T09:00:00Z'
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-12-15T17:00:00Z'
 *     responses:
 *       "200":
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Calculus I
 *                 code:
 *                   type: string
 *                   example: MATH121
 *                 credits:
 *                   type: number
 *                   example: 5
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-09-01T09:00:00Z'
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                   example: '2024-12-15T17:00:00Z'
 *                 qrData:
 *                   type: string
 *                   example: 'http://localhost:3002/attendance?courseId=1234567890abcdef'
 *       "400":
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       "422":
 *         description: Unprocessable entity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */

/**
 * @swagger
 * course/student/courses:
 *   get:
 *     summary: Get courses registered by the student that are within the specified time range
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []  # Assuming JWT or similar authentication is used
 *     responses:
 *       "200":
 *         description: List of courses within the time range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60b6c72f0f9f1b2a1c8d4567"
 *                   name:
 *                     type: string
 *                     example: "Calculus I"
 *                   code:
 *                     type: string
 *                     example: "MATH121"
 *                   credits:
 *                     type: number
 *                     example: 5
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-01T09:00:00Z"
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-12-15T17:00:00Z"
 *       "404":
 *         description: No courses found within the specified time range for this student
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No courses found within the time range for this student"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching courses"
 */

/**
 * @swagger
 * /course/student/course/registration:
 *   post:
 *     summary: Register a student for a course
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []  # Assuming JWT or similar authentication is used
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: The ID of the course to register for
 *                 example: "60b6c72f0f9f1b2a1c8d4567"
 *     responses:
 *       "201":
 *         description: Course registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course registered successfully"
 *       "404":
 *         description: Course or student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course or student not found"
 *       "500":
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering course"
 */


/**
 * @swagger
 * /course/courses:
 *   get:
 *     summary: Fetch all courses
 *     description: Returns a list of courses with their name, id, and code
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "625f25f6328d9f3b8a1b5a1d"
 *                   name:
 *                     type: string
 *                     example: "Introduction to Computer Science"
 *                   code:
 *                     type: string
 *                     example: "CS101"
 *       500:
 *         description: Internal Server Error
 */  
