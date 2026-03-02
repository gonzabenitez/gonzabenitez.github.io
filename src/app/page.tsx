"use client";
import { useState, useMemo, useEffect } from 'react';

import Hero from './components/Hero';
import TagCloud from './components/TagCloud';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import Particles from './components/Particles';

interface Project {
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
  last_pushed: string;
  source: 'github' | 'manual';
  is_fork: boolean;
  is_featured: boolean;
}




export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeTag, setActiveTag] = useState('all');


  useEffect(() => {
    // Fetch the JSON from raw github user content so no rebuild is necessary to get the lastest changes
    fetch('https://raw.githubusercontent.com/gonzabenitez/gonzabenitez.github.io/refs/heads/master/src/public/data/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => console.error("Data sync error:", err));
  }, []);

  



const displayProjects = useMemo(() => {
    const filtered = activeTag === 'all' 
      ? projects 
      : projects.filter(p => p.tags.includes(activeTag));

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.last_pushed || a.date).getTime();
      const dateB = new Date(b.last_pushed || b.date).getTime();
      return dateB - dateA;
    });
  }, [activeTag, projects]);
  
  if (loading) return <div className="bg-zinc-950 min-h-screen" />; // Quiet loading state

return (
    <main className="min-h-screen text-white selection:bg-cyan-500 selection:text-black">
      <Particles />
      <Hero />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {/* Tag Cloud Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Inventory</h2>
            <span className="md:hidden text-[10px] text-cyan-500 font-mono bg-cyan-500/10 px-2 py-1 rounded">
              {activeTag.toUpperCase()}
            </span>
          </div>
          
          {/* Container handles the scroll, component handles the buttons */}
          <div className="overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
            <TagCloud 
              allProjects={projects} 
              activeTag={activeTag} 
              onTagChange={setActiveTag} 
              className="flex-nowrap md:flex-wrap" // This is the key fix
            />
          </div>
        </div>

        {/* Responsive Bento Grid */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-12 grid-flow-row-dense">
  {displayProjects.map((project) => (
    <div 
      key={project.id} 
      onClick={() => setSelectedProject(project)} 
      className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] flex ${
        project.is_featured 
          ? 'md:col-span-7 lg:col-span-7' // Featured: ~60-65% width
          : 'md:col-span-5 lg:col-span-5' // Regular: ~35-40% width
      }`}
    >
      <ProjectCard project={project} />
    </div>
  ))}
</div>
      </section>

      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </main>
  );
}