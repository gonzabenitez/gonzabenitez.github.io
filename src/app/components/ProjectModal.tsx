"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectModal({ project, isOpen, onClose }: { project: any, isOpen: boolean, onClose: () => void }) {
  const [activeImage, setActiveImage] = useState(project?.thumbnail);

  useEffect(() => {
  if (isOpen) {
    // 1. Push a dummy state so there's something to "go back" from
    window.history.pushState({ modalOpen: true }, "");

    // 2. Listen for the back button (popstate)
    const handlePopState = (e: PopStateEvent) => {
      // If the modal is open, close it and prevent navigation
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    // 3. Cleanup: If the modal closes normally, remove the listener
    // and if we still have our dummy state, go back once to clean the history
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }
}, [isOpen, onClose]);

  // Sync image state when a new project is opened
  useEffect(() => {
    if (project) {
      setActiveImage(project.thumbnail);
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
          />

          {/* Main Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] md:top-[7%] z-[60] mx-auto max-w-6xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto lg:overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]"
          >
            {/* Close Button - Floating & High Contrast */}
            {/* STICKY CLOSE BUTTON HEADER */}
  <div className="sticky top-0 z-50 flex justify-end p-4 bg-zinc-950/80 backdrop-blur-md">
    <button 
      onClick={onClose}
      className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
    >
      <X size={24} />
    </button>
  </div>

            <div className="flex flex-col lg:flex-row h-full">
              
              {/* LEFT: Gallery Section */}
              {/* lg:overflow-y-auto ensures the gallery stays put on desktop while text scrolls */}
              <div className="w-full lg:w-3/5 p-6 md:p-10 border-r border-white/5 bg-zinc-900/20 lg:overflow-y-auto no-scrollbar">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-2xl">
                   <motion.img 
                      key={activeImage}
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      src={activeImage} 
                      className="h-full w-full object-cover"
                      alt="Project Preview"
                   />
                </div>
                
                {/* Thumbnails */}
                <div className="mt-6 flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                  {[project.thumbnail, ...project.images].map((img, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative h-16 w-24 md:h-20 md:w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        activeImage === img ? 'border-cyan-500 scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-transparent opacity-40 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="h-full w-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: Content Section */}
              <div className="w-full lg:w-2/5 flex flex-col bg-zinc-950 lg:h-[85vh]">
                <div className="flex-1 lg:overflow-y-auto p-6 md:p-10 no-scrollbar">
                  
                  {/* Header & Title */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal size={14} className="text-cyan-500" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Documentation</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white md:text-4xl tracking-tight leading-tight">
                      {project.title}
                    </h2>
                  </div>

                  {/* Links Action Bar */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/5 text-sm font-medium text-white hover:bg-zinc-800 transition-all active:scale-95"
                    >
                      <Github size={18} /> Source
                    </a>
                    {project.demo && (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-sm font-bold text-black hover:bg-cyan-400 transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                      >
                        <ExternalLink size={18} /> Live Demo
                      </a>
                    )}
                  </div>

                  {/* Markdown Content */}
                  <article className="prose prose-invert prose-cyan max-w-none pb-20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.content}
                    </ReactMarkdown>
                  </article>
                </div>

                {/* Sticky Footer for Tech Stack */}
                <div className="sticky bottom-0 lg:relative p-6 border-t border-white/5 bg-zinc-950/95 lg:bg-zinc-900/20 backdrop-blur-md lg:backdrop-blur-none flex flex-wrap gap-2 shrink-0">
                   {project.tags.map((tag: string) => (
                     <span key={tag} className="px-3 py-1 text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                       #{tag}
                     </span>
                   ))}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}