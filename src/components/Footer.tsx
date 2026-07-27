export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-2 px-4 py-10 text-center text-foreground/55 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide">
        © {new Date().getFullYear()} Vergetti Turismo — Adriano Vergetti de Siqueira Almeida.
        Alagoas, Brasil.
      </p>
    </footer>
  );
}
