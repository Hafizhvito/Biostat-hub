/** Footer situs publik. */

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} FK YARSI - Biostat Hub
      </div>
    </footer>
  );
}
