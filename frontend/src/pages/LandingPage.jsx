import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const canvasRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Trigger stats animation on scroll
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const statsEl = document.getElementById('stats-section');
    if (statsEl) observer.observe(statsEl);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (statsEl) observer.unobserve(statsEl);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d1117] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="max-w-5xl space-y-8">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm animate-fadeIn">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                Next-Gen Online Judge
              </span>
              <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none animate-slideUp">
                MASTER THE <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CLASH.</span>
              </h1>
              <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed animate-slideUp animation-delay-200">
                The ultimate competitive programming arena. Solve complex problems, challenge the global leaderboard, and get mentored by our AI Genie.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 justify-center items-center pt-4 animate-slideUp animation-delay-400">
              <Link to="/register" className="group w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-blue-900/50 hover:shadow-blue-600/60 hover:scale-105 active:scale-95">
                START CODING NOW
                <span className="inline-block ml-2 group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
              </Link>
              <Link to="/login" className="w-full md:w-auto bg-[#161b22]/80 backdrop-blur-sm border border-gray-700 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-105 active:scale-95">
                SIGN IN
              </Link>
            </div>

            {/* Floating code preview */}
            <div className="hidden md:block mt-16 animate-slideUp animation-delay-600">
              <div className="max-w-2xl mx-auto bg-[#161b22]/90 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono ml-2">solution.cpp</span>
                </div>
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <div><span className="text-purple-400">#include</span> <span className="text-green-400">&lt;iostream&gt;</span></div>
                  <div><span className="text-purple-400">using namespace</span> <span className="text-blue-400">std</span>;</div>
                  <div className="mt-2"><span className="text-purple-400">int</span> <span className="text-yellow-300">main</span>() {'{'}</div>
                  <div className="text-gray-500 ml-6">// Your solution here</div>
                  <div className="ml-6"><span className="text-blue-400">cout</span> &lt;&lt; <span className="text-green-400">"Accepted!"</span> &lt;&lt; <span className="text-blue-400">endl</span>;</div>
                  <div className="ml-6"><span className="text-purple-400">return</span> <span className="text-orange-400">0</span>;</div>
                  <div>{'}'}</div>
                </div>
                <div className="px-6 py-3 bg-green-500/10 border-t border-green-500/20 flex items-center gap-2">
                  <span className="text-green-400 text-xs font-black uppercase tracking-wider">Verdict: Accepted</span>
                  <span className="text-green-400">&#10003;</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats-section" className="py-16 px-6 border-y border-gray-800/50 bg-[#161b22]/30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat visible={statsVisible} value="3" label="Languages" suffix="+" delay={0} />
            <AnimatedStat visible={statsVisible} value="100" label="Problems" suffix="+" delay={100} />
            <AnimatedStat visible={statsVisible} value="24/7" label="AI Mentor" suffix="" delay={200} />
            <AnimatedStat visible={statsVisible} value="2s" label="Execution" suffix="" delay={300} />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                BUILT FOR <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CHAMPIONS</span>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Everything you need to become a competitive programming master
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <FeatureCard
                icon={<CodeIcon />}
                title="Monaco Editor"
                desc="Professional-grade code editor with syntax highlighting, auto-complete, and multi-language support."
                gradient="from-blue-600/20 to-cyan-600/20"
                borderColor="border-blue-500/20 hover:border-blue-500/50"
              />
              <FeatureCard
                icon={<AiIcon />}
                title="AI Genie Mentor"
                desc="Get smart hints, approach strategies, and edge case analysis without spoiling the solution."
                gradient="from-purple-600/20 to-pink-600/20"
                borderColor="border-purple-500/20 hover:border-purple-500/50"
              />
              <FeatureCard
                icon={<DockerIcon />}
                title="Docker Sandbox"
                desc="Every submission runs in an isolated Docker container with a 2-second timeout for safety."
                gradient="from-cyan-600/20 to-teal-600/20"
                borderColor="border-cyan-500/20 hover:border-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<TrophyIcon />}
                title="Global Leaderboard"
                desc="Compete with developers worldwide. Track your ranking and climb to the top."
                gradient="from-yellow-600/20 to-orange-600/20"
                borderColor="border-yellow-500/20 hover:border-yellow-500/50"
              />
              <FeatureCard
                icon={<ChartIcon />}
                title="Performance Analytics"
                desc="Track your progress with detailed stats — problems solved, accuracy, and difficulty breakdown."
                gradient="from-green-600/20 to-emerald-600/20"
                borderColor="border-green-500/20 hover:border-green-500/50"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-[#161b22]/30 backdrop-blur-sm border-y border-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                HOW IT <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">WORKS</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30" />
              <StepCard number="01" title="Pick a Challenge" desc="Browse problems filtered by difficulty — Easy, Medium, or Hard" />
              <StepCard number="02" title="Write Code" desc="Use our Monaco editor with C++, Python, or Java" />
              <StepCard number="03" title="Submit & Test" desc="Run against hidden test cases and get instant verdicts" />
              <StepCard number="04" title="Climb Ranks" desc="Solve more, climb the leaderboard, and track your stats" />
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Code in Your Language
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <LangCard name="C++ 17" ext=".cpp" color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/30" />
              <LangCard name="Python 3" ext=".py" color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/30" />
              <LangCard name="Java 17" ext=".java" color="text-orange-400" bg="bg-orange-500/10" border="border-orange-500/30" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent" />
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              READY TO <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">COMPETE?</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Join developers sharpening their skills every day. It's free to start.
            </p>
            <Link to="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-16 py-6 rounded-2xl font-black text-xl transition-all duration-300 shadow-2xl shadow-blue-900/50 hover:shadow-purple-600/50 hover:scale-105 active:scale-95">
              GET STARTED FREE
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-black tracking-tighter">
              <span className="text-blue-500">CODE</span><span className="text-white">CLASH</span>
            </div>
            <p className="text-gray-600 text-sm">
              Built for competitive programming enthusiasts.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const AnimatedStat = ({ visible, value, label, suffix, delay }) => (
  <div className={`text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${delay}ms` }}>
    <div className="text-4xl md:text-5xl font-black text-white">
      {value}<span className="text-blue-400">{suffix}</span>
    </div>
    <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-2">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, desc, gradient, borderColor }) => (
  <div className={`group bg-gradient-to-br ${gradient} bg-[#161b22] p-8 rounded-2xl border ${borderColor} text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/20`}>
    <div className="mb-5 text-gray-400 group-hover:text-white transition-colors duration-300">{icon}</div>
    <h3 className="text-white font-black uppercase text-sm mb-3 tracking-widest">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="text-center space-y-4 relative">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 font-black text-xl relative z-10">
      {number}
    </div>
    <h3 className="text-white font-black text-base uppercase tracking-wide">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const LangCard = ({ name, ext, color, bg, border }) => (
  <div className={`${bg} ${border} border rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 cursor-default`}>
    <div className={`text-3xl font-mono font-black ${color} mb-3`}>{ext}</div>
    <div className="text-white font-bold text-sm">{name}</div>
  </div>
);

// SVG Icons
const CodeIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);
const AiIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);
const DockerIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0h.375a2.625 2.625 0 0 1 0 5.25H17.25" />
  </svg>
);
const TrophyIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.04 6.04 0 0 1-2.77.985m-2.77-.985a6.04 6.04 0 0 0 2.77.985" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export default LandingPage;
