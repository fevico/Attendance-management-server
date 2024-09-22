import { Router } from "express";
import { markAttendance } from "src/controllers/attendance";
import { mustAuth } from "src/middleware/auth";

const attendanceRouter = Router()

attendanceRouter.post('/', mustAuth, markAttendance);


export default attendanceRouter