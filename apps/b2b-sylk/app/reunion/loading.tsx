export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
        <p className="text-xs text-slate-400 dark:text-white/30 tracking-widest uppercase">
          Préparation de votre salle de réunion...
        </p>
      </div>
    </div>
  );
}
