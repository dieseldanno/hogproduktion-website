export default function Footer() {
  return (
    <footer className="border-t-2 border-white bg-pink-600 p-6 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} HÖG Produktion
        <span className="ml-4">Instagram</span>
      </p>
    </footer>
  );
}
