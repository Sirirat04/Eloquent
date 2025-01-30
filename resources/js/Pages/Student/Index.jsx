import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    const { students } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    รายชื่อนักศึกษา
                </h2>
            }
        >
            <Head title="รายชื่อนักศึกษา" />
            <div className="container mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
                <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="py-3 px-4 text-left">ชื่อ</th>
                            <th className="py-3 px-4 text-left">อีเมล</th>
                            <th className="py-3 px-4 text-left">วันเกิด</th>
                            <th className="py-3 px-4 text-left">รายวิชาที่ลงทะเบียน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b">
                                <td className="py-3 px-4">{student.name}</td>
                                <td className="py-3 px-4">{student.email}</td>
                                <td className="py-3 px-4">{student.dob}</td>
                                <td className="py-3 px-4">
                                    {student.registers && student.registers.length > 0 ? (
                                        student.registers.map((register) => (
                                            <div key={register.id}>
                                                {register.course ? `${register.course.name} (${register.course.code})` : "ไม่พบรายวิชา"}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">ยังไม่มีการลงทะเบียน</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
