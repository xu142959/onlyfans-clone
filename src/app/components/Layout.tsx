import { Outlet } from 'react-router';
import { Navigation } from './Navigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-16 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
