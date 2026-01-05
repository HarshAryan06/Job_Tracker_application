'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
    const { theme, setTheme } = useTheme();

    return (
        <footer className="hidden md:block py-8 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="border-t border-border/30 pt-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                        <p className="text-sm text-muted-foreground">
                            Built with <span className="text-amber-500">🍵</span> by{' '}
                            <span className="font-semibold gradient-text-primary">Harsh</span>
                            <span className="mx-2">•</span>
                            © 2026 All rights reserved
                        </p>
                        <div className="flex items-center gap-4">
                            {/* X (Twitter) */}
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                aria-label="X (Twitter)"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            {/* GitHub */}
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                aria-label="GitHub"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            {/* Theme Toggle Switch */}
                            <div className="flex items-center gap-3">
                                <Sun className={`h-4 w-4 transition-colors duration-200 ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground/40'}`} strokeWidth={1.5} />
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 ${theme === 'dark' ? 'bg-muted-foreground/30' : 'bg-muted-foreground/20'
                                        }`}
                                    aria-label="Toggle theme"
                                >
                                    <span
                                        className={`absolute top-1 w-4 h-4 bg-foreground rounded-full shadow-md transition-all duration-300 ease-in-out ${theme === 'dark' ? 'left-7' : 'left-1'
                                            }`}
                                    />
                                </button>
                                <Moon className={`h-4 w-4 transition-colors duration-200 ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground/40'}`} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/30 mt-6"></div>
            </div>
        </footer>
    );
}
