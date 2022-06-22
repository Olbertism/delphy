import Link from 'next/link';

export default function Header(props) {
  return (
    <header>
      <div>A header</div>
      <div>
        {props.user && props.user.username}
        <Link href="/dashboard">Dashboard</Link>

        {props.user ? (
          <Link href="/logout">Logout</Link>
        ) : (
          <>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </div>
    </header>
  );
}
