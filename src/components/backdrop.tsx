/** Fixed ambient layer behind every page: a warm corner glow plus film grain. */
export function Backdrop() {
  return (
    <>
      <div className="backdrop-glow" aria-hidden />
      <div className="backdrop-grain" aria-hidden />
    </>
  );
}
