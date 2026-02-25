'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { X, Menu, ArrowRight, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Upload, Image as ImageIcon } from 'lucide-react';
import { Grainient } from '@/components/ui/grainient';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import GradientText from '@/components/ui/gradient-text';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage: string;
  images: string;
  order: number;
}

interface User {
  id: string;
  username: string;
}

// Work Experience Type
interface WorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  highlights: string[];
  order: number;
}

// Personal Info Type
interface PersonalInfo {
  id: string;
  bio: string;
  email: string;
  wechat: string;
}

// Skills Data
const skills = [
  { name: 'Photoshop', level: 95 },
  { name: 'Figma', level: 90 },
  { name: 'Sketch', level: 85 },
  { name: 'Illustrator', level: 88 },
  { name: 'Cinema 4D', level: 75 },
  { name: 'AI/Midjourney', level: 80 },
];

// Category Labels
const categoryLabels: Record<string, string> = {
  'ToB': 'ToB',
  'App': 'App',
  'Web': 'Web',
  'AI': 'AI',
  'GD': 'GD',
};

export default function Home() {
  // State
  const [currentSection, setCurrentSection] = useState('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'projects' | 'experiences' | 'personalInfo'>('projects');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'ToB',
    coverImage: '',
    images: [] as string[],
  });
  const [experienceForm, setExperienceForm] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
    highlights: [] as string[],
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [personalInfoForm, setPersonalInfoForm] = useState({
    bio: '',
    email: '',
    wechat: '',
  });
  
  const homeRef = useRef<HTMLElement>(null);
  const worksRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // Fetch projects function
  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  // Fetch experiences function
  const fetchExperiences = async () => {
    const res = await fetch('/api/experiences');
    const data = await res.json();
    setExperiences(data.map((exp: { highlights: string }) => ({
      ...exp,
      highlights: JSON.parse(exp.highlights || '[]'),
    })));
  };

  // Fetch personal info function
  const fetchPersonalInfo = async () => {
    const res = await fetch('/api/personal-info');
    const data = await res.json();
    setPersonalInfo(data);
    setPersonalInfoForm({
      bio: data.bio || '',
      email: data.email || '',
      wechat: data.wechat || '',
    });
  };

  // Initialize data
  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      // Initialize database
      fetch('/api/init').then(res => res.json()).then(console.log);
      
      // Fetch projects
      const projectsRes = await fetch('/api/projects');
      const projectsData = await projectsRes.json();
      
      // Fetch experiences
      const experiencesRes = await fetch('/api/experiences');
      const experiencesData = await experiencesRes.json();
      
      // Fetch personal info
      const personalInfoRes = await fetch('/api/personal-info');
      const personalInfoData = await personalInfoRes.json();
      
      // Check auth status
      const authRes = await fetch('/api/auth');
      const authData = await authRes.json();
      
      if (isMounted) {
        setProjects(projectsData);
        setExperiences(experiencesData.map((exp: { highlights: string }) => ({
          ...exp,
          highlights: JSON.parse(exp.highlights || '[]'),
        })));
        setPersonalInfo(personalInfoData);
        setPersonalInfoForm({
          bio: personalInfoData.bio || '',
          email: personalInfoData.email || '',
          wechat: personalInfoData.wechat || '',
        });
        setIsLoggedIn(authData.authenticated);
        setUser(authData.user);
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (homeRef.current) observer.observe(homeRef.current);
    if (worksRef.current) observer.observe(worksRef.current);
    if (aboutRef.current) observer.observe(aboutRef.current);

    return () => observer.disconnect();
  }, []);

  // Image protection - disable right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common screenshot/save shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      // Prevent print screen (limited support)
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      home: homeRef,
      works: worksRef,
      about: aboutRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      
      if (data.success) {
        setIsLoggedIn(true);
        setUser(data.user);
        setIsLoginOpen(false);
        setLoginForm({ username: '', password: '' });
        toast.success('登录成功', { description: '欢迎回来！' });
      } else {
        toast.error('登录失败', { description: data.error });
      }
    } catch {
      toast.error('登录失败', { description: '网络错误' });
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsLoggedIn(false);
    setUser(null);
    setIsAdminOpen(false);
    toast.success('已登出');
  };

  // Image upload handler
  const handleImageUpload = async (file: File, type: 'cover' | 'detail', index?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        if (type === 'cover') {
          setProjectForm({ ...projectForm, coverImage: data.url });
        } else if (type === 'detail' && index !== undefined) {
          const newImages = [...projectForm.images];
          newImages[index] = data.url;
          setProjectForm({ ...projectForm, images: newImages });
        }
        toast.success('图片上传成功');
      } else {
        toast.error('上传失败');
      }
    } catch {
      toast.error('上传失败');
    }
  };

  const addDetailImage = () => {
    setProjectForm({ ...projectForm, images: [...projectForm.images, ''] });
  };

  const removeDetailImage = (index: number) => {
    const newImages = projectForm.images.filter((_, i) => i !== index);
    setProjectForm({ ...projectForm, images: newImages });
  };

  // Project CRUD handlers
  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.coverImage) {
      toast.error('请填写必要信息');
      return;
    }
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      
      if (res.ok) {
        fetchProjects();
        resetProjectForm();
        toast.success('作品创建成功');
      }
    } catch {
      toast.error('创建失败');
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject) return;
    
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProject.id, ...projectForm }),
      });
      
      if (res.ok) {
        fetchProjects();
        setEditingProject(null);
        resetProjectForm();
        toast.success('作品更新成功');
      }
    } catch {
      toast.error('更新失败');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('确定要删除这个作品吗？')) return;
    
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
        toast.success('作品已删除');
      }
    } catch {
      toast.error('删除失败');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'ToB',
      coverImage: '',
      images: [],
    });
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      coverImage: project.coverImage,
      images: JSON.parse(project.images),
    });
  };

  // Experience CRUD handlers
  const handleCreateExperience = async () => {
    if (!experienceForm.company || !experienceForm.position || !experienceForm.period) {
      toast.error('请填写必要信息');
      return;
    }
    
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...experienceForm,
          order: experiences.length,
        }),
      });
      
      if (res.ok) {
        fetchExperiences();
        resetExperienceForm();
        toast.success('工作经历创建成功');
      }
    } catch {
      toast.error('创建失败');
    }
  };

  const handleUpdateExperience = async () => {
    if (!editingExperience) return;
    
    try {
      const res = await fetch('/api/experiences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingExperience.id, ...experienceForm }),
      });
      
      if (res.ok) {
        fetchExperiences();
        setEditingExperience(null);
        resetExperienceForm();
        toast.success('工作经历更新成功');
      }
    } catch {
      toast.error('更新失败');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('确定要删除这条工作经历吗？')) return;
    
    try {
      const res = await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchExperiences();
        toast.success('工作经历已删除');
      }
    } catch {
      toast.error('删除失败');
    }
  };

  const resetExperienceForm = () => {
    setExperienceForm({
      company: '',
      position: '',
      period: '',
      description: '',
      highlights: [],
    });
  };

  const startEditExperience = (exp: WorkExperience) => {
    setEditingExperience(exp);
    setExperienceForm({
      company: exp.company,
      position: exp.position,
      period: exp.period,
      description: exp.description,
      highlights: exp.highlights,
    });
  };

  // Personal Info handler
  const handleSavePersonalInfo = async () => {
    try {
      const res = await fetch('/api/personal-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfoForm),
      });
      
      if (res.ok) {
        fetchPersonalInfo();
        toast.success('个人简介已保存');
      }
    } catch {
      toast.error('保存失败');
    }
  };

  // Upload handlers
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProjectForm({ ...projectForm, coverImage: data.url });
        toast.success('封面上传成功');
      } else {
        toast.error('上传失败');
      }
    } catch {
      toast.error('上传失败');
    }
  };

  const handleDetailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          newImages.push(data.url);
        }
      } catch {
        // continue with next file
      }
    }

    if (newImages.length > 0) {
      setProjectForm({ ...projectForm, images: [...projectForm.images, ...newImages] });
      toast.success(`成功上传 ${newImages.length} 张图片`);
    }
  };

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.category]) acc[project.category] = [];
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">YJ</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">谭亚军</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['home', 'works', 'about'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentSection === section
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {section === 'home' ? '首页' : section === 'works' ? '作品' : '关于'}
                </button>
              ))}
            </div>

            {/* Auth Button */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAdminOpen(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    管理作品
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    登出
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLoginOpen(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  登录
                </Button>
              )}
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/5"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass">
            <div className="px-4 py-3 space-y-1">
              {['home', 'works', 'about'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentSection === section
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {section === 'home' ? '首页' : section === 'works' ? '作品' : '关于'}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section
          id="home"
          ref={homeRef}
          className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden"
        >
          {/* Grainient Background */}
          <div className="absolute inset-0">
            <Grainient
              color1="#0062ff"
              color2="#0f004d"
              color3="#12004d"
              timeSpeed={2.45}
              warpStrength={1.0}
              warpFrequency={5.0}
              warpSpeed={2.0}
              warpAmplitude={50.0}
              noiseScale={2.0}
              grainAmount={0.1}
              contrast={1.5}
              saturation={1.0}
              zoom={0.9}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="text-center">
              {/* Title */}
              <div>
                <p className="text-white/60 text-sm uppercase tracking-widest mb-4 animate-fade-in">UI/UX Designer</p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                  <span className="text-white">Hi, I'm </span>
                  <GradientText
                    colors={['#5227FF', '#ff1af7', '#8e6bff']}
                    animationSpeed={4}
                    direction="horizontal"
                    className="font-bold"
                  >
                    Ah Jun
                  </GradientText>
                </h1>
                <p className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  7年工作经验 · 专注UI/UX设计 · 精通全流程产品设计
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'Cinema 4D', 'AI/Midjourney'].map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 rounded-full text-sm fine-border bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <button
                  onClick={() => scrollToSection('works')}
                  className="animated-button"
                >
                  <ArrowRight className="arr-1" />
                  <ArrowRight className="arr-2" />
                  <span className="circle" />
                  <span className="text">查看作品</span>
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-9 py-4 rounded-full text-base font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white"
                >
                  了解更多
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                {[
                  { value: '7+', label: '年经验' },
                  { value: '50+', label: '项目完成' },
                  { value: '100%', label: '客户满意' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </section>

        {/* Works Section */}
        <section
          id="works"
          ref={worksRef}
          className="min-h-screen py-20 pt-32 relative"
        >
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <p className="text-primary text-sm uppercase tracking-widest mb-4">Portfolio</p>
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">作品展示</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                精选项目案例，展示B端系统、C端应用及创意设计能力
              </p>
            </div>

            {/* Projects Grid - Single column on mobile, masonry on desktop */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Mobile: Single Column - All Projects */}
              <div className="flex-1 space-y-6 md:hidden">
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden gradient-border hover-lift cursor-pointer"
                    style={{ animationDelay: `${index * 0.15}s` }}
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentImageIndex(0);
                    }}
                  >
                    {/* Project Cover */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                    
                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-xl">{project.title}</h4>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                          {categoryLabels[project.category] || project.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
              
              {/* Desktop: Left Column */}
              <div className="hidden md:block flex-1 space-y-24">
                {projects.filter((_, i) => i % 2 === 0).map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden gradient-border hover-lift cursor-pointer"
                    style={{ animationDelay: `${index * 0.15}s` }}
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentImageIndex(0);
                    }}
                  >
                    {/* Project Cover */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                    
                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-xl">{project.title}</h4>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                          {categoryLabels[project.category] || project.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
              
              {/* Desktop: Right Column - with offset */}
              <div className="hidden md:block flex-1 space-y-24 mt-16">
                {projects.filter((_, i) => i % 2 === 1).map((project, index) => (
                  <div
                    key={project.id}
                    className="group relative rounded-2xl overflow-hidden gradient-border hover-lift cursor-pointer"
                    style={{ animationDelay: `${(index + 0.5) * 0.15}s` }}
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentImageIndex(0);
                    }}
                  >
                    {/* Project Cover */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    </div>
                    
                    {/* Project Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-xl">{project.title}</h4>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                          {categoryLabels[project.category] || project.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">暂无作品，请登录后添加</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          ref={aboutRef}
          className="min-h-screen py-20 pt-32 relative"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-primary text-sm uppercase tracking-widest mb-4">About</p>
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">关于我</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                专注于UI/UX设计，致力于创造优秀的用户体验
              </p>
            </div>

            <div className="grid lg:grid-cols-10 gap-8">
              {/* Left: Timeline - 70% */}
              <div className="lg:col-span-7">
                <h3 className="text-2xl font-semibold mb-6">工作经历</h3>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {experiences.map((exp, index) => (
                      <div key={exp.id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-card flex items-center justify-center fine-border">
                          <div className="w-3 h-3 rounded-full bg-primary animate-pulse-glow" />
                        </div>

                        {/* Content Card */}
                        <SpotlightCard
                          className="gradient-border rounded-xl p-6 hover-lift"
                          spotlightColor="rgba(94, 106, 210, 0.2)"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-0 mb-2">
                            <h4 className="font-semibold text-lg">{exp.company}</h4>
                            <span className="text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full w-fit">
                              {exp.period}
                            </span>
                          </div>
                          <p className="text-primary text-sm mb-3">{exp.position}</p>
                          <p className="text-muted-foreground text-sm mb-4">{exp.description}</p>
                          <ul className="space-y-2">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </SpotlightCard>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Bio & Skills - 30% */}
              <div className="lg:col-span-3">
                {/* Bio */}
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold mb-6">个人简介</h3>
                  {personalInfo?.bio?.split('\n').filter(Boolean).map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold mb-6">专业技能</h3>
                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6">联系方式</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">邮箱</p>
                        <p className="text-foreground">{personalInfo?.email || '未设置'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.026-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">微信</p>
                        <p className="text-foreground">{personalInfo?.wechat || '未设置'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-12 fine-border border-l-0 border-r-0 border-b-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">YJ</span>
              </div>
              <span className="text-muted-foreground">© 2024 谭亚军. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>UI/UX Designer</span>
              <span>•</span>
              <span>7年经验</span>
              <span>•</span>
              <span>专注产品设计</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl">登录</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">用户名</label>
              <Input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="请输入用户名"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">密码</label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="请输入密码"
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              登录
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Panel Dialog */}
      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl">管理后台</DialogTitle>
          </DialogHeader>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4 border-b border-white/10 pb-2">
            <button
              onClick={() => setAdminTab('projects')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                adminTab === 'projects' 
                  ? 'bg-primary/20 text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              作品管理
            </button>
            <button
              onClick={() => setAdminTab('experiences')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                adminTab === 'experiences' 
                  ? 'bg-primary/20 text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              工作经历
            </button>
            <button
              onClick={() => setAdminTab('personalInfo')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                adminTab === 'personalInfo' 
                  ? 'bg-primary/20 text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              个人简介
            </button>
          </div>
          
          {/* Projects Tab */}
          {adminTab === 'projects' && (
          <div className="mt-4 space-y-6">
            {/* Add/Edit Form */}
            <div className="gradient-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">{editingProject ? '编辑作品' : '添加作品'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">作品名称 *</label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="输入作品名称"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">分类</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm"
                  >
                    <option value="ToB">ToB</option>
                    <option value="App">App</option>
                    <option value="Web">Web</option>
                    <option value="AI">AI</option>
                    <option value="GD">GD</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">作品描述</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="输入作品描述"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">封面图片 *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {projectForm.coverImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10">
                        <img
                          src={projectForm.coverImage}
                          alt="封面预览"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-8 h-8 text-white" />
                          <span className="text-white ml-2">点击更换</span>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">点击上传封面图片</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">详情图片</label>
                  <div className="space-y-3">
                    {/* 已上传的图片列表 */}
                    {projectForm.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {projectForm.images.map((img, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 group">
                            <img src={img} alt={`详情图 ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeDetailImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 上传按钮 */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleDetailUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="aspect-video rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                        <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">点击上传详情图片（可多选）</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingProject ? '更新' : '添加'}
                </Button>
                {editingProject && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProject(null);
                      resetProjectForm();
                    }}
                    className="fine-border bg-transparent"
                  >
                    取消
                  </Button>
                )}
              </div>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              <h3 className="font-semibold">作品列表 ({projects.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="gradient-border rounded-xl p-4 group relative">
                    <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-white/5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium truncate">{project.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{categoryLabels[project.category]}</p>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/10"
                        onClick={() => startEditProject(project)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Experiences Tab */}
          {adminTab === 'experiences' && (
          <div className="mt-4 space-y-6">
            {/* Add/Edit Form */}
            <div className="gradient-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">{editingExperience ? '编辑工作经历' : '添加工作经历'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">公司名称 *</label>
                  <Input
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    placeholder="输入公司名称"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">职位 *</label>
                  <Input
                    value={experienceForm.position}
                    onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                    placeholder="输入职位"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">工作时间 *</label>
                  <Input
                    value={experienceForm.period}
                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                    placeholder="例如: 2023/03 - 2026/03"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">工作描述</label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    placeholder="输入工作描述"
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-2 block">工作亮点（每行一个）</label>
                  <textarea
                    value={experienceForm.highlights.join('\n')}
                    onChange={(e) => setExperienceForm({ 
                      ...experienceForm, 
                      highlights: e.target.value.split('\n').filter(Boolean) 
                    })}
                    placeholder="主导司库系统4.0产品设计&#10;完成多家银行资金管理系统设计&#10;建立设计规范与组件库"
                    rows={4}
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={editingExperience ? handleUpdateExperience : handleCreateExperience}
                  className="bg-primary hover:bg-primary/90"
                >
                  {editingExperience ? '更新' : '添加'}
                </Button>
                {editingExperience && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingExperience(null);
                      resetExperienceForm();
                    }}
                    className="fine-border bg-transparent"
                  >
                    取消
                  </Button>
                )}
              </div>
            </div>

            {/* Experiences List */}
            <div className="space-y-4">
              <h3 className="font-semibold">工作经历列表 ({experiences.length})</h3>
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="gradient-border rounded-xl p-4 group relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{exp.company}</h4>
                        <p className="text-sm text-primary">{exp.position}</p>
                        <p className="text-xs text-muted-foreground mt-1">{exp.period}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-white/10"
                          onClick={() => startEditExperience(exp)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Personal Info Tab */}
          {adminTab === 'personalInfo' && (
          <div className="mt-4 space-y-6">
            <div className="gradient-border rounded-xl p-6">
              <h3 className="font-semibold mb-4">编辑个人简介</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">个人简介（每段用换行分隔）</label>
                  <textarea
                    value={personalInfoForm.bio}
                    onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, bio: e.target.value })}
                    placeholder="5年设计经验，参与百万级产品设计..."
                    rows={8}
                    className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">邮箱</label>
                    <Input
                      value={personalInfoForm.email}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">微信</label>
                    <Input
                      value={personalInfoForm.wechat}
                      onChange={(e) => setPersonalInfoForm({ ...personalInfoForm, wechat: e.target.value })}
                      placeholder="微信号"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  onClick={handleSavePersonalInfo}
                  className="bg-primary hover:bg-primary/90"
                >
                  保存
                </Button>
              </div>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden bg-card border-white/10 p-0">
          {selectedProject && (
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="p-6 fine-border border-l-0 border-r-0 border-t-0">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <p className="text-sm text-primary mt-1">{categoryLabels[selectedProject.category]}</p>
                <p className="text-muted-foreground mt-3">{selectedProject.description}</p>
              </div>

              {/* Image Viewer */}
              <div className="flex-1 relative bg-black/20 flex items-center justify-center min-h-[400px]">
                <img
                  src={JSON.parse(selectedProject.images)[currentImageIndex] || selectedProject.coverImage}
                  alt={`${selectedProject.title} - ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[60vh] object-contain"
                />
                
                {/* Navigation Arrows */}
                {JSON.parse(selectedProject.images).length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
                      onClick={() => setCurrentImageIndex(i => i > 0 ? i - 1 : JSON.parse(selectedProject.images).length - 1)}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70"
                      onClick={() => setCurrentImageIndex(i => i < JSON.parse(selectedProject.images).length - 1 ? i + 1 : 0)}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {JSON.parse(selectedProject.images).length > 1 && (
                <div className="p-4 fine-border border-l-0 border-r-0 border-b-0 overflow-x-auto">
                  <div className="flex gap-2 justify-center">
                    {JSON.parse(selectedProject.images).map((img: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-sm">
                {currentImageIndex + 1} / {JSON.parse(selectedProject.images).length || 1}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
