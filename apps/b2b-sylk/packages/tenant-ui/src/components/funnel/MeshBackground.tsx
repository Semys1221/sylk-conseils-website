"use client";

export function MeshBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-200/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-purple-200/10 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}
