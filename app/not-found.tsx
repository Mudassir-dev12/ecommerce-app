import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-neutral-900">404</h1>
      <h2 className="text-2xl font-bold text-neutral-800 mt-2">Page Not Found</h2>
      <p className="text-neutral-500 text-sm mt-2 max-w-md">
        Sorry, the page or product you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-primary-700 transition-all"
      >
        Return to Home Page
      </Link>
    </div>
  );
}
