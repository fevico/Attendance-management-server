import { Router } from "express";
import { createCourse, getStudentCourses, markAttendance } from "src/controllers/course";
import { mustAuth } from "src/middleware/auth";

const courseRouter = Router()

courseRouter.post('/create', createCourse)
courseRouter.get('/attendance',mustAuth, markAttendance)
courseRouter.get('/student/courses',mustAuth, getStudentCourses)

export default courseRouter;