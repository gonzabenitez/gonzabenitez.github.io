export default function TagCloud({ allProjects, activeTag, onTagChange, className = "" }: { 
  allProjects: any[], 
  activeTag: string, 
  onTagChange: (tag: string) => void,
  className?: string 
}) {
  const uniqueTags = Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort();

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={() => onTagChange('all')}
        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-mono transition ${
          activeTag === 'all' ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-500 border border-white/5'
        }`}
      >
        #ALL_PROJECTS
      </button>
      {uniqueTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] font-mono transition ${
            activeTag === tag ? 'bg-cyan-500 text-black' : 'bg-zinc-900 text-zinc-500 border border-white/5'
          }`}
        >
          #{tag.toUpperCase()}
        </button>
      ))}
    </div>
  );
}