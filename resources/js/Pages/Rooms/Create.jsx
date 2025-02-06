import { useForm, router } from '@inertiajs/react'; // Ensure router is imported
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

export default function Create({ rooms }) {
    const { data, setData, post, errors } = useForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '', // Add customer_email field
        room_id: '',
        check_in_date: '',
        check_out_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.customer_name || !data.customer_phone || !data.customer_email) { // Check customer_email
            Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
            });
            return;
        }

        if (!data.room_id) {
            Swal.fire({
                icon: 'error',
                title: 'ไม่มีห้องที่เลือก',
                text: 'กรุณาเลือกห้องที่ต้องการจอง',
            });
            return;
        }

        if (new Date(data.check_out_date) <= new Date(data.check_in_date)) {
            Swal.fire({
                icon: 'error',
                title: 'วันที่ไม่ถูกต้อง',
                text: 'วันที่เช็คเอาท์ต้องมากกว่าวันที่เช็คอิน',
            });
            return;
        }

        // Ensure the status value is correctly set
        const selectedRoom = rooms.find(room => room.id === data.room_id);
        if (selectedRoom && selectedRoom.status !== 'not_reserved') {
            Swal.fire({
                icon: 'error',
                title: 'ห้องถูกจองแล้ว',
                text: 'กรุณาเลือกห้องที่ยังไม่ถูกจอง',
            });
            return;
        }

        console.log('Submitting booking data:', data); // Debugging log

        post('/bookings', {
            ...data,
            status: 'reserved', // Set the status to 'reserved'
        }, {
            onSuccess: (response) => {
                console.log('onSuccess triggered:', response); // ตรวจสอบคำตอบที่ได้รับจากเซิร์ฟเวอร์
                if (response && response.data) {
                    Swal.fire({
                        icon: 'success',
                        title: 'การจองสำเร็จ',
                        text: 'การจองของคุณถูกบันทึกแล้ว',
                        showConfirmButton: true,
                    }).then(() => {
                        console.log('Redirecting to rooms index');
                        router.get('/rooms'); // เปลี่ยนหน้าไปที่หน้าห้อง
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง',
                    });
                }
            },
            
            
        });
    };

    const availableRooms = rooms.filter((room) => room.status === 'not_reserved');

    return (
        <AuthenticatedLayout>
            <div className="p-8 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-pink-700 mb-6">Create Booking</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            value={data.customer_name}
                            onChange={(e) => setData('customer_name', e.target.value)}
                            className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        {errors.customer_name && <div className="text-red-500 mt-1">{errors.customer_name}</div>}
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Customer Phone</label>
                        <input
                            type="text"
                            value={data.customer_phone}
                            onChange={(e) => setData('customer_phone', e.target.value)}
                            className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        {errors.customer_phone && <div className="text-red-500 mt-1">{errors.customer_phone}</div>}
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Customer Email</label>
                        <input
                            type="email"
                            value={data.customer_email}
                            onChange={(e) => setData('customer_email', e.target.value)}
                            className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        {errors.customer_email && <div className="text-red-500 mt-1">{errors.customer_email}</div>}
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Select Room</label>
                        {availableRooms.length > 0 ? (
                            <select
                                value={data.room_id}
                                onChange={(e) => setData('room_id', e.target.value)}
                                className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="">Please select a room</option>
                                {availableRooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.room_number} (Not Reserved)
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="text-red-500">No reserved rooms for booking.</div>
                        )}
                        {errors.room_id && <div className="text-red-500 mt-1">{errors.room_id}</div>}
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Check-in Date</label>
                        <input
                            type="date"
                            value={data.check_in_date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('check_in_date', e.target.value)}
                            className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        {errors.check_in_date && <div className="text-red-500 mt-1">{errors.check_in_date}</div>}
                    </div>

                    <div>
                        <label className="block mb-2 text-lg font-medium text-gray-700">Check-out Date</label>
                        <input
                            type="date"
                            value={data.check_out_date}
                            min={data.check_in_date || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('check_out_date', e.target.value)}
                            className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        {errors.check_out_date && <div className="text-red-500 mt-1">{errors.check_out_date}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={availableRooms.length === 0}
                        className={`p-3 w-full rounded-lg shadow-lg text-lg font-semibold transition ${availableRooms.length > 0
                            ? 'bg-pink-600 text-white hover:bg-pink-700'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                            }`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}