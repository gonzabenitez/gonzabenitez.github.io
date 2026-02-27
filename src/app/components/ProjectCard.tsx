import { useState, useEffect } from 'react';
import { ImageIcon, Github, ExternalLink } from 'lucide-react';
import { formatDistanceToNow, isValid } from 'date-fns'; 

export interface Project {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  images: string[];
  url: string;
  demo: string;
  tags: string[];
  date: string;
  source: string;
  is_fork: boolean; // 👈 Add this line
}


export default function ProjectCard({ project }: { project: any }) {
const [mounted, setMounted] = useState(false);
const handleLinkClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevents the Modal from opening
};
  // Triggered only on the client after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const rawDate = project.last_pushed || project.date;
  const dateObj = new Date(rawDate);
  const hasValidDate = rawDate && isValid(dateObj);

  const updatedTime = hasValidDate 
    ? formatDistanceToNow(dateObj, { addSuffix: true }) 
    : 'Recently';

  const isRecent = hasValidDate 
    ? (new Date().getTime() - dateObj.getTime()) < (7 * 24 * 60 * 60 * 1000) 
    : false;
  return (
    <div className="group relative flex flex-col w-full h-full rounded-3xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-900">
      
      {/* Thumbnail with Gallery Overlay */}
      <div className={`relative w-full overflow-hidden rounded-2xl bg-zinc-800 ${
  project.is_featured ? 'aspect-[16/10] md:aspect-[16/7]' : 'aspect-video'
}`}>
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Cyan Glow on Hover */}
        <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-t from-cyan-950/40 to-transparent" />

        {/* Gallery Badge */}
        {project.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2 py-1 text-[10px] backdrop-blur-md">
            <ImageIcon size={12} className="text-cyan-400" />
            <span>{project.images.length} Photos</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2">
       {isRecent && (
         <span className="relative flex h-2 w-2">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
         </span>
       )}
       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
         Updated {updatedTime}
       </span>
    </div>

      {/* Content */}
      <div className="mt-5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">
              {project.title}
            </h3>
            <div className="flex gap-3 text-zinc-500">
              <a href={project.url} target="_blank" className="hover:text-white" onClick={handleLinkClick}><Github size={18} /></a>
              {project.demo && (
                <a href={project.demo} target="_blank" className="text-cyan-500 hover:text-cyan-300" onClick={handleLinkClick}>
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
          
          <p className="mt-2 line-clamp-2 text-sm text-zinc-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex gap-2">
            {project.tags.slice(0, 2).map((tag: string) => (
              <span key={tag} className="text-[10px] font-mono text-cyan-500/70 lowercase">
                #{tag}
              </span>
            ))}
          </div>
          {project.is_fork && (
            <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Collaborative</span>
          )}
        </div>
      </div>
    </div>
  );
}