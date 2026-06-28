'use client';
import { CircleUser } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { use } from 'react';
export default function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
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

  const { id } = use(params);
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-linear-to-b from-black to-slate-900">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-col  max-w-sm bg-[#171717] p-8 rounded-2xl border border-[#2e2e2e] gap-6 shadow-2xl w-fit">
        <h1 className="text-white text-3xl font-semibold">User Profile Page</h1>
        <div className="flex items-center gap-2">
          <CircleUser size={100} strokeWidth={1.25} color="white" />
          <div className="flex flex-col w-fit">
            <p className="text-white ">ID:{id}</p>
            <p className="text-white ">Username: </p>
            <p className="text-gray-500 ">Email:</p>
          </div>
        </div>
        <button
          className="bg-white text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors w-full"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
