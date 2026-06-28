'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyemailPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post('/api/users/verifyemail', { token });
      toast.success('Email verified successfully');
      setVerified(true);
    } catch (error) {
      setError(true);
      console.log(error.reponse.data);
      toast.error(error.reponse.data);
    }
  };
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verified]);

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || '');
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-linear-to-b from-black to-slate-900">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-col  max-w-sm bg-[#171717] p-8 rounded-2xl border border-[#2e2e2e] gap-6 shadow-2xl w-fit">
        <h1 className="text-white text-3xl font-semibold">
          Verify Your Email Address
        </h1>
        {!verified && (
          <p className="text-gray-500 ">
            Please check your email inbox to verify your email address.
          </p>
        )}
        {error && <p className="text-red-500 ">Error in verification.</p>}
        {verified && (
          <div>
            {' '}
            <p className="text-green-500 ">Email verified successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
}
