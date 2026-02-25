'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './card-nav.css';

interface NavLink {
  label: string;
  href: string;
}

interface NavCard {
  label: string;
  description: string;
  links: NavLink[];
  bgColor?: string;
  textColor?: string;
}

interface CardNavProps {
  logo?: React.ReactNode;
  currentSection?: string;
  onNavigate?: (section: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
  onLogin?: () => void;
  onLogout?: () => void;
  onAdmin?: () => void;
  className?: string;
}

const navCards: NavCard[] = [
  {
    label: '首页',
    description: '个人简介与技能展示',
    links: [
      { label: '关于我', href: '#home' },
      { label: '技能专长', href: '#home' },
    ],
    bgColor: 'rgba(94, 106, 210, 0.15)',
    textColor: '#fff',
  },
  {
    label: '作品',
    description: '精选项目案例展示',
    links: [
      { label: 'B端UI设计', href: '#works' },
      { label: 'C端APP设计', href: '#works' },
      { label: 'AI平面3D设计', href: '#works' },
    ],
    bgColor: 'rgba(124, 58, 237, 0.15)',
    textColor: '#fff',
  },
  {
    label: '关于',
    description: '工作经历与联系方式',
    links: [
      { label: '工作经历', href: '#about' },
      { label: '专业技能', href: '#about' },
    ],
    bgColor: 'rgba(37, 99, 235, 0.15)',
    textColor: '#fff',
  },
];

export function CardNav({
  logo,
  currentSection = 'home',
  onNavigate,
  isLoggedIn = false,
  userName,
  onLogin,
  onLogout,
  onAdmin,
  className = '',
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 200;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const contentEl = navEl.querySelector('.card-nav-content');
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = 'visible';
        contentEl.style.pointerEvents = 'auto';
        contentEl.style.position = 'static';
        contentEl.style.height = 'auto';

        void contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 200;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight(),
      duration: 0.4,
      ease: 'power3.out',
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 },
      '-=0.1'
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    }, []);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const handleLinkClick = (href: string) => {
    const section = href.replace('#', '');
    onNavigate?.(section);
    // Close menu after clicking
    if (isExpanded) {
      const tl = tlRef.current;
      if (tl) {
        setIsHamburgerOpen(false);
        tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
        tl.reverse();
      }
    }
  };

  // Set card ref
  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? 'Close menu' : 'Open menu'}
            tabIndex={0}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            {logo || (
              <div className="logo-default">
                <span>YJ</span>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="user-actions">
              <button
                type="button"
                className="card-nav-cta-button secondary"
                onClick={onAdmin}
              >
                管理
              </button>
              <button
                type="button"
                className="card-nav-cta-button"
                onClick={onLogout}
              >
                登出
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="card-nav-cta-button"
              onClick={onLogin}
            >
              登录
            </button>
          )}
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {navCards.map((card, idx) => (
            <div
              key={card.label}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: card.bgColor, color: card.textColor }}
            >
              <div className="nav-card-header">
                <div className="nav-card-label">{card.label}</div>
                <div className="nav-card-desc">{card.description}</div>
              </div>
              <div className="nav-card-links">
                {card.links.map((lnk, i) => (
                  <button
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    onClick={() => handleLinkClick(lnk.href)}
                    aria-label={lnk.label}
                  >
                    <svg
                      className="nav-card-link-icon"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
