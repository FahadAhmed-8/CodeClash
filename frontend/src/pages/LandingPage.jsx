import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const canvasRef = useRef(null);

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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        particles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 120)})`;
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

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d1117] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="max-w-5xl space-y-8">
            <div className="space-y-6 animate-fadeIn">
              <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/30 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                Next-Gen Online Judge
              </span>
              <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">
                MASTER THE <span className="text-blue-500 animate-pulse">CLASH.</span>
              </h1>
              <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
                The ultimate competitive programming arena. Solve complex problems, challenge the global leaderboard, and get mentored by our proactive AI Genie.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-5 justify-center items-center pt-4">
              <Link to="/register" className="group w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/70 hover:scale-105">
                START CODING NOW
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/login" className="w-full md:w-auto bg-[#161b22]/80 backdrop-blur-sm border border-gray-700 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-gray-800 hover:border-gray-600 transition-all duration-300">
                SIGN IN
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                BUILT FOR <span className="text-blue-500">CHAMPIONS</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to become a competitive programming master
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FeatureCard 
                icon="🧞" 
                title="AI Genie" 
                desc="Real-time logic analysis and proactive debugging hints powered by advanced AI."
                gradient="from-purple-600/20 to-blue-600/20"
              />
              <FeatureCard 
                icon="🚀" 
                title="Docker Runner" 
                desc="Lightning-fast code execution in isolated, secure Docker environments."
                gradient="from-blue-600/20 to-cyan-600/20"
              />
              <FeatureCard 
                icon="🏆" 
                title="Leaderboard" 
                desc="Compete with the world and climb the global rankings in real-time."
                gradient="from-cyan-600/20 to-teal-600/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon="⚡" 
                title="Real-Time Contests (Upcoming)" 
                desc="Join live coding contests and compete against the best programmers worldwide."
                gradient="from-yellow-600/20 to-orange-600/20"
              />
              <FeatureCard 
                icon="📊" 
                title="Performance Analytics" 
                desc="Track your progress with detailed insights and personalized recommendations."
                gradient="from-pink-600/20 to-red-600/20"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6 bg-[#161b22]/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                HOW IT <span className="text-blue-500">WORKS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <StepCard number="01" title="Choose Problem" desc="Select from hundreds of curated coding challenges" />
              <StepCard number="02" title="Write Code" desc="Code in your favorite language with our advanced editor" />
              <StepCard number="03" title="Get Feedback" desc="Receive instant AI-powered hints and analysis" />
              <StepCard number="04" title="Climb Ranks" desc="Earn points and rise through the leaderboard" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-tight">
              READY TO <span className="text-blue-500">COMPETE?</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Join thousands of developers sharpening their skills every day
            </p>
            <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-16 py-6 rounded-2xl font-black text-xl transition-all duration-300 shadow-2xl shadow-blue-900/50 hover:shadow-blue-800/70 hover:scale-105">
              GET STARTED FREE
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, gradient }) => (
  <div className={`group bg-gradient-to-br ${gradient} bg-[#161b22] p-8 rounded-3xl border border-gray-800 text-left hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/30`}>
    <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-white font-black uppercase text-sm mb-3 tracking-widest">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="text-center space-y-4">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500/50 text-blue-400 font-black text-xl mb-4">
      {number}
    </div>
    <h3 className="text-white font-black text-lg uppercase tracking-wide">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;