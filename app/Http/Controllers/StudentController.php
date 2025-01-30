<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Course;
use App\Models\Register;
use Inertia\Inertia;

class StudentController extends Controller
{
    // แสดงรายชื่อนักศึกษาทั้งหมด
    public function index()
    {
        $students = Student::with('registers.course')->get(); // ดึงข้อมูลนักศึกษาพร้อมกับข้อมูลที่ลงทะเบียน
        return Inertia::render('Student/Index', ['students' => $students]); // ส่งข้อมูลไปที่หน้า Student/Index
    }

    // เพิ่มนักศึกษาใหม่
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:students',
            'dob' => 'required|date',
        ]);

        $student = Student::create($request->all());
        return response()->json($student, 201);
    }

    // แสดงรายละเอียดของนักศึกษา
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student);
    }

    // อัปเดตข้อมูลนักศึกษา
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->all());
        return response()->json($student);
    }

    // ลบนักศึกษา
    public function destroy($id)
    {
        Student::destroy($id);
        return response()->json(['message' => 'Deleted successfully']);
    }

    // ลงทะเบียนนักศึกษาในรายวิชา
    public function registerCourse(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        $register = Register::create($request->all());
        return response()->json($register, 201);
    }

    // แสดงรายวิชาที่นักศึกษาลงทะเบียน
    public function studentCourses($student_id)
    {
        $student = Student::with('registers.course')->findOrFail($student_id);
        return response()->json($student->registers);
    }
}
