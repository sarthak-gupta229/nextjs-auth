export default async function UserProfile({params}:{params: Promise <{id: any}>}) {
    const {id}= await params;
    return (
        <div className="flex flex-col w-full min-h-screen justify-center items-center bg-linear-to-b from-black to-slate-900">
            <h1 className="text-white">User Profile Page</h1>
            <p className="text-white">Name: {id}</p>
        </div>
    );
}