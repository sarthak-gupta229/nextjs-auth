'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    username: '',
    password: '',
  });
  const [hidePassword, setHidePassword] = React.useState(false);

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/signup', user);
      console.log('Signup success', response.data);
      toast.success('Signed up successfully!');
      router.push('/verifyemail');

    } catch (error: any) {
      console.log('Signup failed', error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length >= 8
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-black to-slate-900">
      <Toaster position="top-right" reverseOrder={true} />
      <div className="flex flex-col w-full max-w-sm bg-[#171717] p-8 rounded-2xl border border-[#2e2e2e] gap-6 shadow-2xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl text-white font-bold">
            {loading ? 'Processing' : 'Create an account'}
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your information below to create your account
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white text-sm font-medium" htmlFor="username">
            Full Name
          </label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="bg-[#0a0a0a] text-white placeholder-gray-500 border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="bg-[#0a0a0a] text-white placeholder-gray-500 border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors"
            placeholder="m@example.com"
            required
          />
          <p className="text-gray-500 text-xs">
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-white text-sm font-medium" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={hidePassword ? 'text' : 'password'}
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full bg-[#0a0a0a] text-white placeholder-gray-500 border border-[#2e2e2e] rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:border-gray-500 transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setHidePassword(!hidePassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label={hidePassword ? 'Hide password' : 'Show password'}
            >
              {hidePassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <p
            className={`text-xs ${user.password && user.password.length < 8 ? 'text-red-500' : 'text-gray-500'} `}
          >

            Must be at least 8 characters long.
          </p>
        </div>

        {/* <div className="flex flex-col gap-1.5">
                    <label className="text-white text-sm font-medium" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input 
                        type="password"
                        id="confirmPassword"
                        className="bg-[#0a0a0a] text-white placeholder-gray-500 border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors"
                        required
                    />
                    <p className="text-gray-500 text-xs">Please confirm your password.</p>
                </div> */}

        <div className="flex flex-col gap-3">
          <button
            onClick={onSignup}
            disabled={buttonDisabled}
            className="w-full bg-white text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            Create Account
          </button>
          {/* <button
            type="button"
            className="w-full bg-transparent text-white font-semibold py-2.5 rounded-lg text-sm border border-gray-600 hover:bg-gray-800 transition-colors"
          >
            Sign up with Google
          </button> */}
        </div>

        <p className="text-gray-500 text-sm text-center">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-gray-300 underline hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
