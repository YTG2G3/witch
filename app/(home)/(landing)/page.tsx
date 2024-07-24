export default function Landing() {
  return (
    <div>
      {new Array(150).fill(0).map((v) => (
        <p key={v}>{v}</p>
      ))}
    </div>
  );
}
