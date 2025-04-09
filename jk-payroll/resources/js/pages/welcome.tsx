import Layout from '@/layouts/Layout';
import { type SharedData } from '@/types';
import { usePage, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const routeToLogin = ()=>{
        router.get('/login'); // Redirects to the Login page
    }

    return (
        <>
            <Layout>
                <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                    <div className="w-80 rounded-2xl bg-white p-10 text-center shadow-xl">
                        <h2 className="mb-6 text-3xl font-bold text-gray-800">Login</h2>
                        <button onClick={routeToLogin} className="w-full transform rounded-lg bg-blue-600 py-3 text-white shadow-md transition-transform hover:scale-105 hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                </div>
            </Layout>
        </>
    );
}
