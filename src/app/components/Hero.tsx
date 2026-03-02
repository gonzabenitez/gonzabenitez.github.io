import { Github, Linkedin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-12 md:pt-40 md:pb-24">
      <div className="mx-auto max-w-6xl flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold tracking-tighter md:text-8xl">
            Gonza <span className="text-zinc-700 font-light">Benitez</span>
          </h1>
          <p className="mt-6 max-w-xl text-zinc-400 text-base md:text-lg leading-relaxed mx-auto md:mx-0">
            Full-stack developer specializing in <span className="text-cyan-400">automation</span>. 
            I build self-maintaining systems and high-end digital experiences.
          </p>




<div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
  {/* The Badge */}
  <div className="px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-mono tracking-widest">
    AVAILABLE FOR PROJECTS
  </div>

  {/* The Socials */}
  <div className="flex items-center gap-5">
    <a 
      href="https://github.com/gonzabenitez" 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all duration-300"
    >
      <Github size={18} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">/github</span>
    </a>

    <div className="h-4 w-[1px] bg-zinc-800" /> {/* Subtle Divider */}

    <a 
      href="https://linkedin.com/in/gonza-benitez" // Update this!
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-zinc-500 hover:text-cyan-400 transition-all duration-300"
    >
      <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">/linkedin</span>
    </a>
  </div>
</div>
        </div>

        {/* Adjusted Photo Frame for Mobile */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border border-cyan-500/20 p-2">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl">
              <img 
                src="/assets/profile-pic.jpg" 
                alt="Profile" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}