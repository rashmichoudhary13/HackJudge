export default function Loader({
    size = 12,
    className = "",
  }) {
    return (
      <div className={`flex items-end justify-center gap-2 ${className}`}>
        <span
          className="rounded-full bg-violet-600 animate-dotBounce"
          style={{
            width: size,
            height: size,
            animationDelay: "0ms",
          }}
        />
        <span
          className="rounded-full bg-fuchsia-500 animate-dotBounce"
          style={{
            width: size,
            height: size,
            animationDelay: "150ms",
          }}
        />
        <span
          className="rounded-full bg-indigo-500 animate-dotBounce"
          style={{
            width: size,
            height: size,
            animationDelay: "300ms",
          }}
        />
      </div>
    );
  }