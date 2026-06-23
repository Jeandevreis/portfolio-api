export default function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 text-base">
      {children}
    </div>
  );
}
