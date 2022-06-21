import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <div>A header</div>
      <div>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>
      </div>
    </header>
  );
}
