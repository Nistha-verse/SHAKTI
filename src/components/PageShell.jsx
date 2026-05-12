export default function PageShell({ children, className = '' }) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </section>
  );
}
