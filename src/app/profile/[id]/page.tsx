import { CircleUser } from "lucide-react";
export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: any }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-linear-to-b from-black to-slate-900">
      <div className="flex flex-col w-full max-w-sm bg-[#171717] p-8 rounded-2xl border border-[#2e2e2e] gap-6 shadow-2xl">
        <h1 className="text-white text-3xl font-semibold">User Profile Page</h1>
        <div className="flex items-center gap-2">
        <CircleUser size={100} color="white" />
        <div className="flex flex-col">
        <p className="text-white text-2xl">Name: {id}</p>
        <p className="text-white text-1xl">Email:</p>
        </div>
        </div>
        <button className="bg-white text-black font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-200 transition-colors w-full">Logout</button>
      </div>
    </div>
  );
}
