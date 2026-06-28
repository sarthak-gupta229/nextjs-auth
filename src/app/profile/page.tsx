'use client';
import { CircleUser } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState('');

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

//   const getUserDetails = async () => {
//     try {
//       const res = await axios.get('/api/users/me');
//       console.log(res.data.data._id);
//       toast.success("user details fetched successfully");
//       setData(res.data.data._id);
//     } catch (error: any) {
//       console.log(error.message);
//       toast.error(error.message);
//     }
//   };

  useEffect(() => {
    const getUserDetails = async () => {
    try {
      const res = await axios.get('/api/users/me');
      const userId = res.data.data._id;
      console.log(userId);
      toast.success("user details fetched successfully");
      setData(userId);
      router.push(`/profile/${userId}`);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
    getUserDetails();

  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-b from-black to-slate-900">
      <Toaster position="top-right" reverseOrder={false} />
      <h1>Profile Page</h1>
      <h1 className="text-white">user id: {data}</h1>
{/* 
      <button
        className="bg-green-600 text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-green-300 transition-colors p-2 m-3"
        onClick={getUserDetails}
      >
        Get User Details
      </button> */}
      <button
        className="bg-white text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors p-2"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
