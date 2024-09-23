import { Router } from "express";
import { markAttendance } from "src/controllers/attendance";
import { mustAuth } from "src/middleware/auth";

const attendanceRouter = Router()

attendanceRouter.post('/', mustAuth, markAttendance);


export default attendanceRouter

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Api endpoint to manage user attendance
 */

/**
 * @swagger
 * /attendance/{courseId}:
 *   post:
 *     summary: mark attendance for a course
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to retrieve
 *         example: 60f6a8b2d3b2a29b9c8e1234
 *     responses:
 *       "200":
 *         description: Successfully retrieved course details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 60f6a8b2d3b2a29b9c8e1234
 *       "400":
 *         description: Bad request, invalid courseId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid course ID format"
 *       "404":
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course not found"
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
