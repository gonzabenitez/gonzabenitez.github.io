import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectModal({ project, isOpen, onClose }: { project: any, isOpen: boolean, onClose: () => void }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-[5%] z-[60] mx-auto max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-10 shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-6 top-6 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>

            {/* Header */}
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-white md:text-5xl">{project.title}</h2>
              <div className="mt-4 flex gap-4">
                <a href={project.url} target="_blank" className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400">
                  <Github size={20} /> Source
                </a>
                {project.demo && (
                  <a href={project.demo} target="_blank" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300">
                    <ExternalLink size={20} /> Live Demo
                  </a>
                )}
              </div>
            </header>

            {/* Horizontal Scroll Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
              {project.images.map((img: string, i: number) => (
                <img 
                  key={i} src={img} 
                  className="h-64 md:h-96 w-auto rounded-xl snap-center border border-white/5" 
                  alt={`${project.title} screenshot ${i}`}
                />
              ))}
            </div>

            {/* Rendered Markdown */}
            <article className="prose prose-invert prose-cyan max-w-none border-t border-white/5 pt-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            </article>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}