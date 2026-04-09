'use client';

import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">AKIJ RESOURCE</h1>
          <span className="text-sm text-gray-500">Online Test Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}