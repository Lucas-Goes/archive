interface FooterProps {
  username: string;
}

export function Footer({ username }: FooterProps) {
  return (
    <div
      className="
        fixed bottom-0 left-0 w-full
        flex justify-center
        py-3
        z-50
      "
      style={{
        backgroundColor: "var(--footer-bg)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid var(--border)",
        }}
    >
      <span
        className="text-sm opacity-70"
        style={{ color: "var(--text)" }}
      >
        archive.app/{username}
      </span>
    </div>
  );
}