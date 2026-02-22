'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Loader2, 
  Download, 
  Check, 
  ArrowLeft,
  Zap,
  Shield,
  Users,
  BarChart3,
  Clock,
  Star,
  Menu,
  X
} from 'lucide-react';
import { LandingPage } from '@/types';

// Icon mapping for features
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Shield,
  Users,
  BarChart: BarChart3,
  BarChart3,
  Clock,
  Star,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Zap;
}

function LandingBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams.get('id');
  const contextFromUrl = searchParams.get('context');
  
  const [context, setContext] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LandingPage | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load project if ID is in URL or context from analyzer
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else if (contextFromUrl) {
      // Check for context parameter from analyzer
      setContext(decodeURIComponent(contextFromUrl));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, contextFromUrl]);

  const loadProject = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      const project = await res.json();
      
      if (project) {
        setContext(project.input);
        setResult(project.output);
        setModel(project.modelUsed === 'llama-3.3-70b-versatile' ? 'groq' : project.modelUsed);
        setIsViewingHistory(true);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const generate = async () => {
    setLoading(true);
    setIsViewingHistory(false);
    
    try {
      const res = await fetch('/api/landing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, model }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateHTML = (landing: LandingPage): string => {
    const featuresHTML = landing.features?.map((f, i) => {
      const icons = ['Zap', 'Shield', 'Users', 'BarChart3', 'Clock', 'Star'];
      const iconSvg = icons[i % icons.length];
      return `
        <div class="feature-card">
          <div class="feature-icon">${iconSvg}</div>
          <h3>${f.title}</h3>
          <p>${f.description}</p>
        </div>
      `;
    }).join('') || '';

    const stepsHTML = landing.howItWorks?.steps?.map(s => `
      <div class="step">
        <div class="step-number">${s.step}</div>
        <h4>${s.title}</h4>
        <p>${s.description}</p>
      </div>
    `).join('') || '';

    const testimonialsHTML = landing.testimonials?.map(t => `
      <div class="testimonial">
        <p class="quote">"${t.quote}"</p>
        <div class="author">
          <strong>${t.author}</strong>
          <span>${t.role}${t.company ? `, ${t.company}` : ''}</span>
        </div>
      </div>
    `).join('') || '';

    const statsHTML = landing.stats?.map(s => `
      <div class="stat">
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('') || '';

    const faqHTML = landing.faq?.map((item, i) => `
      <div class="faq-item">
        <h4>${item.question}</h4>
        <p>${item.answer}</p>
      </div>
    `).join('') || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${landing.headline}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    
    /* Navigation */
    nav { background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
    .nav-container { max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.5rem; font-weight: bold; color: #E31E24; }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a { text-decoration: none; color: #555; font-weight: 500; }
    .nav-links a:hover { color: #E31E24; }
    
    /* Hero */
    .hero { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 6rem 2rem; text-align: center; }
    .hero h1 { font-size: 3.5rem; margin-bottom: 1.5rem; max-width: 900px; margin-left: auto; margin-right: auto; }
    .hero p { font-size: 1.25rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; opacity: 0.9; }
    .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
    .btn-primary { background: #E31E24; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; border: none; cursor: pointer; }
    .btn-primary:hover { background: #c41a1f; }
    .btn-secondary { background: transparent; color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; border: 2px solid white; }
    .btn-secondary:hover { background: white; color: #1a1a2e; }
    
    /* Problem/Solution */
    .problem-solution { padding: 4rem 2rem; background: #f8f9fa; }
    .container { max-width: 1200px; margin: 0 auto; }
    .problem-solution-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
    .problem h2, .solution h2 { color: #E31E24; margin-bottom: 1rem; }
    .problem p, .solution p { font-size: 1.1rem; color: #555; }
    
    /* Features */
    .features { padding: 5rem 2rem; }
    .section-header { text-align: center; margin-bottom: 3rem; }
    .section-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .section-header p { font-size: 1.1rem; color: #666; }
    .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .feature-card { background: #f8f9fa; padding: 2rem; border-radius: 12px; text-align: center; }
    .feature-icon { width: 60px; height: 60px; background: #E31E24; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.5rem; }
    .feature-card h3 { margin-bottom: 0.5rem; color: #1a1a2e; }
    .feature-card p { color: #666; }
    
    /* How It Works */
    .how-it-works { padding: 5rem 2rem; background: #1a1a2e; color: white; }
    .how-it-works .section-header h2 { color: white; }
    .how-it-works .section-header p { color: #aaa; }
    .steps { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem; margin-top: 3rem; }
    .step { text-align: center; max-width: 250px; }
    .step-number { width: 50px; height: 50px; background: #E31E24; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-weight: bold; font-size: 1.25rem; }
    .step h4 { margin-bottom: 0.5rem; }
    .step p { color: #aaa; }
    
    /* Stats */
    .stats { padding: 4rem 2rem; background: #E31E24; color: white; }
    .stats-grid { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem; text-align: center; }
    .stat-value { font-size: 3rem; font-weight: bold; }
    .stat-label { font-size: 1.1rem; opacity: 0.9; }
    
    /* Testimonials */
    .testimonials { padding: 5rem 2rem; background: #f8f9fa; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .testimonial { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .testimonial .quote { font-size: 1.1rem; color: #444; margin-bottom: 1rem; font-style: italic; }
    .testimonial .author { display: flex; flex-direction: column; }
    .testimonial .author strong { color: #1a1a2e; }
    .testimonial .author span { color: #888; font-size: 0.9rem; }
    
    /* FAQ */
    .faq { padding: 5rem 2rem; }
    .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .faq-item { background: #f8f9fa; padding: 1.5rem; border-radius: 8px; }
    .faq-item h4 { color: #1a1a2e; margin-bottom: 0.5rem; }
    .faq-item p { color: #666; }
    
    /* CTA */
    .cta { padding: 5rem 2rem; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; text-align: center; }
    .cta h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .cta p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
    
    /* Footer */
    footer { background: #1a1a2e; color: #aaa; padding: 3rem 2rem 2rem; }
    .footer-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2rem; }
    .footer-brand { max-width: 300px; }
    .footer-brand .logo { margin-bottom: 1rem; }
    .footer-links { display: flex; gap: 3rem; }
    .footer-links-column h4 { color: white; margin-bottom: 1rem; }
    .footer-links-column a { display: block; color: #aaa; text-decoration: none; margin-bottom: 0.5rem; }
    .footer-links-column a:hover { color: #E31E24; }
    .footer-bottom { max-width: 1200px; margin: 2rem auto 0; padding-top: 2rem; border-top: 1px solid #333; text-align: center; }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero h1 { font-size: 2rem; }
      .problem-solution-grid { grid-template-columns: 1fr; gap: 2rem; }
      .nav-links { display: none; }
      .faq-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-container">
      <div class="logo">${landing.navLogo || 'Brand'}</div>
      <div class="nav-links">
        ${landing.navLinks?.map(link => `<a href="#${link.toLowerCase().replace(/\s+/g, '-')}">${link}</a>`).join('') || ''}
      </div>
    </div>
  </nav>

  <section class="hero">
    <h1>${landing.headline}</h1>
    <p>${landing.subheadline}</p>
    <div class="hero-buttons">
      <a href="#cta" class="btn-primary">${landing.heroCta}</a>
      ${landing.heroSecondaryCta ? `<a href="#features" class="btn-secondary">${landing.heroSecondaryCta}</a>` : ''}
    </div>
  </section>

  ${landing.problemStatement || landing.solutionStatement ? `
  <section class="problem-solution">
    <div class="container problem-solution-grid">
      ${landing.problemStatement ? `
      <div class="problem">
        <h2>The Problem</h2>
        <p>${landing.problemStatement}</p>
      </div>
      ` : ''}
      ${landing.solutionStatement ? `
      <div class="solution">
        <h2>Our Solution</h2>
        <p>${landing.solutionStatement}</p>
      </div>
      ` : ''}
    </div>
  </section>
  ` : ''}

  <section class="features" id="features">
    <div class="container">
      <div class="section-header">
        <h2>${landing.featuresSectionTitle || 'Key Features'}</h2>
        <p>${landing.featuresSectionSubtitle || ''}</p>
      </div>
      <div class="features-grid">
        ${featuresHTML}
      </div>
    </div>
  </section>

  ${landing.howItWorks ? `
  <section class="how-it-works" id="how-it-works">
    <div class="container">
      <div class="section-header">
        <h2>${landing.howItWorks.title}</h2>
      </div>
      <div class="steps">
        ${stepsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${landing.stats ? `
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        ${statsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${landing.testimonials ? `
  <section class="testimonials">
    <div class="container">
      <div class="section-header">
        <h2>What Our Customers Say</h2>
      </div>
      <div class="testimonials-grid">
        ${testimonialsHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${landing.faq ? `
  <section class="faq" id="faq">
    <div class="container">
      <div class="section-header">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div class="faq-grid">
        ${faqHTML}
      </div>
    </div>
  </section>
  ` : ''}

  ${landing.finalCta ? `
  <section class="cta" id="cta">
    <div class="container">
      <h2>${landing.finalCta.title}</h2>
      <p>${landing.finalCta.subtitle}</p>
      <a href="#" class="btn-primary">${landing.finalCta.buttonText}</a>
    </div>
  </section>
  ` : ''}

  <footer>
    <div class="footer-content">
      <div class="footer-brand">
        <div class="logo">${landing.navLogo || 'Brand'}</div>
        <p>${landing.footerTagline || ''}</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>${landing.copyright || '© 2025 All rights reserved.'}</p>
    </div>
  </footer>
</body>
</html>`;
  };

  const downloadHTML = () => {
    if (!result) return;
    
    const html = generateHTML(result);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.navLogo?.toLowerCase().replace(/\s+/g, '-') || 'landing-page'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const clearForm = () => {
    setContext('');
    setResult(null);
    setIsViewingHistory(false);
    router.push('/landing-builder');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-400 eastern-peak:text-green-500" />
            {isViewingHistory ? 'View Landing Page' : 'Landing Page Builder'}
          </h1>
          {isViewingHistory && (
            <button
              onClick={clearForm}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors eastern-peak:bg-gray-100 eastern-peak:hover:bg-gray-200"
            >
              <ArrowLeft size={16} className="inline mr-1" />
              New
            </button>
          )}
        </div>
        
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          disabled={isViewingHistory}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm disabled:opacity-50 eastern-peak:bg-white eastern-peak:border-gray-300"
        >
          <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
          <option value="groq">Groq (Llama 3.3)</option>
        </select>
      </div>

      {/* Input */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 eastern-peak:bg-white eastern-peak:border-gray-200">
        <label className="block text-sm font-medium mb-2 text-slate-300 eastern-peak:text-gray-600">
          {isViewingHistory ? 'Original Context' : 'Project Context'}
        </label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          readOnly={isViewingHistory}
          placeholder="Describe your product/service, target audience, key benefits, and any specific messaging you want on the landing page..."
          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm focus:ring-2 focus:ring-purple-500 resize-none read-only:bg-slate-900/30 eastern-peak:bg-white eastern-peak:border-gray-300 eastern-peak:text-gray-800"
        />
        
        {!isViewingHistory && (
          <button
            onClick={generate}
            disabled={loading || context.length < 10}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors eastern-peak:bg-green-600 eastern-peak:hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating Landing Page...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Complete Landing Page
              </>
            )}
          </button>
        )}
      </div>

      {/* Results Preview */}
      {result && (
        <div className="space-y-6">
          {/* Export Button */}
          <div className="flex justify-end">
            <button
              onClick={downloadHTML}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors eastern-peak:bg-green-600 eastern-peak:hover:bg-green-700"
            >
              {downloaded ? <Check size={18} /> : <Download size={18} />}
              {downloaded ? 'Downloaded!' : 'Download HTML'}
            </button>
          </div>

          {/* Landing Page Preview */}
          <div className="bg-white rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Preview Navigation */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <span className="font-semibold text-lg">{result.navLogo || 'Brand'}</span>
              <div className="hidden md:flex gap-6 text-sm">
                {result.navLinks?.slice(0, 4).map((link, i) => (
                  <span key={i} className="text-slate-300 hover:text-white cursor-pointer">{link}</span>
                ))}
              </div>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">{result.headline}</h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">{result.subheadline}</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  {result.heroCta}
                </button>
                {result.heroSecondaryCta && (
                  <button className="border-2 border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    {result.heroSecondaryCta}
                  </button>
                )}
              </div>
            </div>

            {/* Problem/Solution */}
            {(result.problemStatement || result.solutionStatement) && (
              <div className="px-6 py-12 bg-slate-50">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                  {result.problemStatement && (
                    <div>
                      <h3 className="text-red-600 font-semibold mb-2">The Problem</h3>
                      <p className="text-slate-700">{result.problemStatement}</p>
                    </div>
                  )}
                  {result.solutionStatement && (
                    <div>
                      <h3 className="text-green-600 font-semibold mb-2">Our Solution</h3>
                      <p className="text-slate-700">{result.solutionStatement}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features Section */}
            <div className="px-6 py-12">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{result.featuresSectionTitle}</h3>
                <p className="text-slate-600">{result.featuresSectionSubtitle}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {result.features?.map((feature, i) => {
                  const IconComponent = getIcon(feature.icon || 'Zap');
                  return (
                    <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How It Works */}
            {result.howItWorks && (
              <div className="px-6 py-12 bg-slate-900 text-white">
                <h3 className="text-2xl font-bold text-center mb-10">{result.howItWorks.title}</h3>
                <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                  {result.howItWorks.steps?.map((step, i) => (
                    <div key={i} className="text-center max-w-xs">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                        {step.step}
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-slate-400">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {result.stats && (
              <div className="px-6 py-12 bg-purple-600 text-white">
                <div className="flex flex-wrap justify-center gap-12 text-center">
                  {result.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-4xl font-bold">{stat.value}</div>
                      <div className="text-purple-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials */}
            {result.testimonials && (
              <div className="px-6 py-12 bg-slate-50">
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">What Our Customers Say</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {result.testimonials.map((testimonial, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-slate-700 mb-4 italic">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.author}</div>
                        <div className="text-sm text-slate-500">
                          {testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {result.faq && (
              <div className="px-6 py-12">
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h3>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {result.faq.map((item, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-xl">
                      <h4 className="font-semibold text-slate-900 mb-2">{item.question}</h4>
                      <p className="text-sm text-slate-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final CTA */}
            {result.finalCta && (
              <div className="px-6 py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">{result.finalCta.title}</h3>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">{result.finalCta.subtitle}</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-lg font-medium text-lg transition-colors">
                  {result.finalCta.buttonText}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="bg-slate-950 text-slate-400 px-6 py-8 text-center">
              <p className="text-sm">{result.copyright}</p>
            </div>
          </div>

          {isViewingHistory && (
            <div className="text-center text-sm text-slate-500 eastern-peak:text-gray-500">
              Saved landing page from history
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LandingBuilderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    }>
      <LandingBuilderContent />
    </Suspense>
  );
}
