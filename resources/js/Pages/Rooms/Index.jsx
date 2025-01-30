import React from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
  const { bookings } = usePage().props;  // ดึงข้อมูลการจองจาก props

  console.log(bookings);  // ตรวจสอบข้อมูลที่ได้จาก props

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          รายการการจองที่พัก
        </h2>
      }
    >
      <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-lg">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">ชื่อของลูกค้า</th>
              <th className="py-3 px-4 text-left">หมายเลขโทรศัพท์</th>
              <th className="py-3 px-4 text-left">หมายเลขห้อง</th>
              <th className="py-3 px-4 text-left">สถานะห้อง</th>
              <th className="py-3 px-4 text-left">ประเภทห้อง</th>
              <th className="py-3 px-4 text-left">วันที่เช็คอิน</th>
              <th className="py-3 px-4 text-left">วันที่เช็คเอาท์</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{booking.customer_name}</td>
                <td className="py-3 px-4">{booking.customer_phone}</td>
                <td className="py-3 px-4">{booking.room_number}</td>
                <td className="py-3 px-4">{booking.room_status}</td>
                <td className="py-3 px-4">{booking.room_type}</td>
                <td className="py-3 px-4">{booking.check_in_date}</td>
                <td className="py-3 px-4">{booking.check_out_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AuthenticatedLayout >
  );
}
