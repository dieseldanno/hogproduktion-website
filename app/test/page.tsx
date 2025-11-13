export default function Test() {
  return (
    <div className="p-8">
      <h1>Env Test</h1>
      <pre>DATABASE_URL: {process.env.DATABASE_URL}</pre>
      <pre>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET}</pre>
    </div>
  );
}
