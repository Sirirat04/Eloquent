import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

export default function Edit() {
    const { booking, rooms } = usePage().props;
    const [formData, setFormData] = useState({
        customer_name: booking.customer.name || '',
        customer_phone: booking.customer.phone || '',
        room_id: booking.room.id || '',
        check_in_date: booking.check_in_date || '',
        check_out_date: booking.check_out_date || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure the status value is correctly set
        const selectedRoom = rooms.find(room => room.id === formData.room_id);
        if (selectedRoom && selectedRoom.status !== 'not_reserved') {
            Swal.fire({
                icon: 'error',
                title: 'ห้องถูกจองแล้ว',
                text: 'กรุณาเลือกห้องที่ยังไม่ถูกจอง',
            });
            return;
        }
        router.put(`/rooms/${booking.id}`, {
            ...formData,
            status: 'reserved', // Set the status to 'reserved'
        }, {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'อัปเดตข้อมูลสำเร็จ',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    router.get('/rooms');
                });
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="container mx-auto p-8 bg-gradient-to-br from-pink-50 to-indigo-100 shadow-xl rounded-xl max-w-3xl">
                <h2 className="text-4xl font-bold text-center text-pink-700 mb-8">แก้ไขข้อมูลการจอง</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-lg font-medium mb-2 text-gray-800">ชื่อลูกค้า</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2 text-gray-800">เบอร์โทรลูกค้า</label>
                        <input
                            type="text"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2 text-gray-800">เลือกห้อง</label>
                        <select
                            name="room_id"
                            value={formData.room_id}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
                        >
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    ห้อง {room.room_number} ({room.status})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2 text-gray-800">วันที่เช็คอิน</label>
                        <input
                            type="date"
                            name="check_in_date"
                            value={formData.check_in_date}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium mb-2 text-gray-800">วันที่เช็คเอาท์</label>
                        <input
                            type="date"
                            name="check_out_date"
                            value={formData.check_out_date}
                            onChange={handleChange}
                            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white p-4 rounded-lg shadow-md font-semibold hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
