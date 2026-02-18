import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
    Sun, Moon, User, LogOut, ChevronDown, 
    Sparkles, CheckCircle, FileText, Briefcase, 
    Layout, BookOpen, PenTool, Users, BarChart, 
    MessageSquare, ExternalLink, Folder, Menu 
} from 'lucide-react';
import { Switch } from './ui/switch';
import { cn } from '../lib/utils';
import Logo from './Logo';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import '../styles/Navbar.css';

const ListItem = React.forwardRef(({ className, title, children, icon: Icon, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4 text-emerald-500" />}
                        <div className="text-sm font-medium leading-none">{title}</div>
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

const MobileMenu = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="navbar-mobile-trigger" aria-label="Open menu">
                    <Menu className="h-6 w-6" />
                </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>
                        <Logo />
                    </SheetTitle>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="resume">
                        <AccordionTrigger>Resume</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 pl-4 pt-2">
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">AI Resume Builder</a>
                                <a href="#analyzer" className="text-sm py-2 hover:text-emerald-500 transition-colors">Resume Checker</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Resume Examples</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Resume Skills</a>
                                <a href="/templates" className="text-sm py-2 hover:text-emerald-500 transition-colors">Resume Templates</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Resume Writing Guides</a>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cover-letter">
                        <AccordionTrigger>Cover Letter</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 pl-4 pt-2">
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">AI Cover Letter Builder</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Cover Letter Examples</a>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="blog">
                        <AccordionTrigger>Blog</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 pl-4 pt-2">
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Career Advice</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Success Stories</a>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="org">
                        <AccordionTrigger>For Organizations</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-2 pl-4 pt-2">
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Enterprise Solutions</a>
                                <a href="#" className="text-sm py-2 hover:text-emerald-500 transition-colors">Hiring Analytics</a>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-4 mt-6">
                    <a href="#pricing" className="text-sm font-medium py-2 border-b">Pricing</a>
                    <div className="flex flex-col gap-3 pt-4">
                        <a href="/login" className="btn-sign-in text-center">Sign In</a>
                        <a href="/signup" className="btn-get-started text-center">Get Started</a>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

const Navbar = ({ backendStatus }) => {
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const checkUser = () => {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
        };
        checkUser();

        // Banner fade out after 5 seconds
        const bannerTimer = setTimeout(() => {
            setShowBanner(false);
        }, 5000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(bannerTimer);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    if (!mounted) return null;

    return (
        <motion.nav
            className={cn(
                "navbar-new transition-all duration-500",
                scrolled ? "navbar-scrolled" : "navbar-initial"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
            <AnimatePresence>
                {backendStatus === 'offline' && showBanner && (
                    <motion.div 
                        className="backend-offline-banner"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                            height: { 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 40,
                                restDelta: 0.001
                            },
                            opacity: { 
                                duration: 0.3,
                                ease: "easeOut" 
                            }
                        }}
                    >
                        <span className="flex items-center gap-2 justify-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                            Backend is offline. Features limited.
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="navbar-container">
                <div className="flex items-center gap-4">
                    <MobileMenu />
                    <a href="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </a>
                </div>

                <div className="navbar-navigation">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            {/* Resume Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="nav-trigger">Resume</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2 lg:w-[800px]">
                                        <div className="flex flex-col gap-3">
                                            <ul className="grid gap-3">
                                                <ListItem href="#" title="AI Resume Builder" icon={Sparkles}>
                                                    Create a professional resume in minutes with AI.
                                                </ListItem>
                                                <ListItem href="#analyzer" title="Resume Checker" icon={CheckCircle}>
                                                    Get instant feedback on your resume's impact.
                                                </ListItem>
                                                <div className="px-3 py-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Folder className="h-4 w-4 text-emerald-500" />
                                                        <h5 className="text-sm font-semibold">Resume Examples</h5>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-6">
                                                        <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-slate-400"></span> Project Manager
                                                        </a>
                                                        <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-slate-400"></span> Data Scientist
                                                        </a>
                                                        <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-slate-400"></span> Scrum Master
                                                        </a>
                                                        <a href="#" className="text-xs text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-2">
                                                            <span className="h-1 w-1 rounded-full bg-slate-400"></span> Business Analyst
                                                        </a>
                                                    </div>
                                                </div>
                                                <ListItem href="#" title="Resume Skills" icon={Briefcase}>
                                                    Find the best keywords for your experience.
                                                </ListItem>
                                            </ul>
                                        </div>
                                        <div className="flex flex-col gap-4 border-l pl-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Layout className="h-4 w-4 text-emerald-500" />
                                                    <h5 className="text-sm font-semibold">Resume Templates</h5>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mb-3">Creative resume for creative industries to capture the recruiter's attention</p>
                                                <div className="grid grid-cols-1 gap-1">
                                                    <a href="/templates?category=creative" className="text-xs font-medium hover:text-emerald-500 transition-colors">Creative Templates</a>
                                                    <a href="/templates?category=traditional" className="text-xs font-medium hover:text-emerald-500 transition-colors">Traditional Templates</a>
                                                    <a href="/templates?category=modern" className="text-xs font-medium hover:text-emerald-500 transition-colors">Modern Templates</a>
                                                    <a href="/templates?category=simple" className="text-xs font-medium hover:text-emerald-500 transition-colors">Simple Templates</a>
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <BookOpen className="h-4 w-4 text-emerald-500" />
                                                    <h5 className="text-sm font-semibold">Resume Writing Guides</h5>
                                                </div>
                                                <ul className="space-y-2">
                                                    <li>
                                                        <a href="#" className="block">
                                                            <div className="text-xs font-medium hover:text-emerald-500 transition-colors">Writing a Resume</div>
                                                            <p className="text-[10px] text-muted-foreground">The most comprehensive guide on the internet about writing a resume</p>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="block">
                                                            <div className="text-xs font-medium hover:text-emerald-500 transition-colors">Resume Summary</div>
                                                            <p className="text-[10px] text-muted-foreground">How to include and write a summary that gets your point across quickly</p>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="block">
                                                            <div className="text-xs font-medium hover:text-emerald-500 transition-colors">Choosing a Resume Format</div>
                                                            <p className="text-[10px] text-muted-foreground">The different resume formats, which one is best for your use case</p>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" className="block">
                                                            <div className="text-xs font-medium hover:text-emerald-500 transition-colors">Fitting Experience on One Page</div>
                                                            <p className="text-[10px] text-muted-foreground">The tricks behind fitting a lot of experience on a single page</p>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Cover Letter Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="nav-trigger">Cover Letter</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                                        <ListItem href="#" title="AI Cover Letter Builder" icon={PenTool}>
                                            Tailor your cover letter to every job.
                                        </ListItem>
                                        <ListItem href="#" title="Cover Letter Examples" icon={FileText}>
                                            Browse examples for various roles.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Blog Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="nav-trigger">Blog</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4">
                                        <ListItem href="#" title="Career Advice" icon={MessageSquare}>
                                            Expert tips on job hunting and interviews.
                                        </ListItem>
                                        <ListItem href="#" title="Success Stories" icon={Sparkles}>
                                            How others landed their dream jobs.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* For Organizations Dropdown */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="nav-trigger">For Organizations</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4">
                                        <ListItem href="#" title="Enterprise Solutions" icon={Users}>
                                            Resume intelligence for large teams.
                                        </ListItem>
                                        <ListItem href="#" title="Hiring Analytics" icon={BarChart}>
                                            Data-driven recruitment insights.
                                        </ListItem>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* Pricing Link */}
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <a href="#pricing" className="nav-link-item">
                                        Pricing
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="navbar-actions">
                    <div className="theme-toggle">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            aria-label="Toggle theme"
                        />
                        <Moon className="h-4 w-4 text-blue-500" />
                    </div>
                    {user ? (
                        <div className="user-menu">
                            <div className="user-info">
                                <User className="user-icon" size={16} />
                                <span className="user-name">{user.name}</span>
                            </div>
                            <button
                                className="btn-logout"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <a href="/login" className="btn-sign-in">Sign In</a>
                            <a href="/signup" className="btn-get-started">Get Started</a>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
