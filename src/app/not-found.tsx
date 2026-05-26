import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <div className="text-govblue text-5xl font-semibold mb-3">404</div>
      <h1 className="mb-3">Page not found</h1>
      <p className="text-muted mb-6">The page you requested could not be found.</p>
      <Link
        href="/"
        className="inline-block bg-govblue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-govblue-dark"
      >
        Return to the home page
      </Link>
    </div>
  );
}
