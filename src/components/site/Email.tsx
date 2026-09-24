/**
 * Renders an email address as plain text without a contiguous `name@domain`
 * string in the HTML. Cloudflare's Email Address Obfuscation rewrites any such
 * string on the fly, so the browser's DOM no longer matches what React
 * server-rendered and hydration fails (React error #418). Splitting at the "@"
 * keeps the visible text identical while giving Cloudflare nothing to match.
 */
export function Email({ address, className }: { address: string; className?: string }) {
  const [user, domain] = address.split("@");
  return (
    <span className={className}>
      {user}
      <span>@</span>
      {domain}
    </span>
  );
}
