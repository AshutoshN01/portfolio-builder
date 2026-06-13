export function PageContainer({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-background text-text-primary pt-16 md:pt-20 ${className}`}>
      <main id="main-content" tabIndex="-1" className="outline-none">
        {children}
      </main>
    </div>
  );
}
