'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useApplications, useFileUpload } from '@/hooks';
import { Application, ApplicationStatus } from '@/types';
import { calculateStats, calculateProgressPercentage } from '@/lib/stats';
import { 
  ArrowLeft, 
  ArrowRight,
  Upload, 
  CheckCircle, 
  Briefcase, 
  FilePlus, 
  Building2,
  MapPin,
  FileText,
  Sparkles,
  Send,
  X,
  Info,
  TrendingUp,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function AddApplicationPage() {
  const router = useRouter();
  const { applications, addApplication } = useApplications();
  const { fileData, handleFileChange, clearFile } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => calculateStats(applications), [applications]);
  const progressPercentage = useMemo(() => calculateProgressPercentage(stats), [stats]);
  
  const responseRate = useMemo(() => {
    if (applications.length === 0) return 0;
    const responded = applications.filter(app => 
      app.status !== ApplicationStatus.APPLIED && app.status !== ApplicationStatus.PENDING
    ).length;
    return Math.round((responded / applications.length) * 100);
  }, [applications]);

  const offerRate = useMemo(() => {
    if (applications.length === 0) return 0;
    return Math.round((stats.offers / applications.length) * 100);
  }, [stats, applications]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const app: Application = {
      id: crypto.randomUUID(),
      companyName: formData.get('companyName') as string,
      role: formData.get('role') as string,
      location: formData.get('location') as string || 'Remote',
      status: formData.get('status') as ApplicationStatus,
      resumeName: formData.get('resumeName') as string,
      resumeFile: fileData || undefined,
      notes: '',
      jobDescription: formData.get('jobDescription') as string,
      dateApplied: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    
    addApplication(app);
    clearFile();
    toast.success('Application added successfully!', {
      description: `${app.companyName} - ${app.role}`,
    });
    router.push('/applications');
  };

  // Compact Circular Progress Component
  const CompactProgressRing = ({ percentage, label, value, gradientId }: { percentage: number; label: string; value: string | number; gradientId: string }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - animatedPercentage / 100);

    useEffect(() => {
      const duration = 1000;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setAnimatedPercentage(Math.round(eased * percentage));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [percentage]);

    return (
      <Card className="overflow-hidden card-hover group">
        <CardContent className="p-5 flex flex-col items-center justify-center relative">
          <div className="relative w-28 h-28 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" style={{ transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-muted/20"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.1s ease-out',
                  filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.3))',
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-extrabold tracking-tight stats-number">{value}</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{label}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl transition-transform duration-300 hover:scale-105">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg glow-sm">
              <FilePlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                <span className="gradient-text-primary">Add</span> Application
              </h2>
              <p className="text-muted-foreground text-xs font-medium">
                Track a new company you applied to
              </p>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="gradient-bg-subtle hidden sm:flex">
          <Sparkles className="h-3 w-3 mr-1.5" />
          New Application
        </Badge>
      </header>

      {/* Analytics Section */}
      {applications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
          <CompactProgressRing 
            percentage={responseRate} 
            label="Response"
            value={`${responseRate}%`}
            gradientId="progressGradient1"
          />
          <CompactProgressRing 
            percentage={progressPercentage} 
            label="Interview"
            value={`${progressPercentage}%`}
            gradientId="progressGradient2"
          />
          <CompactProgressRing 
            percentage={offerRate} 
            label="Offer"
            value={`${offerRate}%`}
            gradientId="progressGradient3"
          />
        </div>
      )}

      {/* Quick Stats Cards */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-1">
          {[
            { icon: Briefcase, value: applications.length, label: 'Total Apps', color: 'from-orange-500 to-amber-500', textColor: 'stats-number' },
            { icon: Target, value: stats.interviews, label: 'Interviews', color: 'from-blue-500 to-cyan-500', textColor: 'text-blue-500' },
            { icon: CheckCircle, value: stats.offers, label: 'Offers', color: 'from-emerald-500 to-green-500', textColor: 'text-emerald-500' },
            { icon: Calendar, value: stats.applied, label: 'Applied', color: 'from-purple-500 to-pink-500', textColor: 'text-purple-500' },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              className="card-hover overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transition-transform duration-500 ease-out group-hover:scale-110`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information Section */}
        <Card className="overflow-hidden animate-fade-in-up stagger-1 card-hover">
          <CardHeader className="gradient-bg-subtle border-b border-border/50 p-5 px-6">
            <CardTitle className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
              <Building2 className="h-4 w-4 text-primary" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2.5 group">
                <Label htmlFor="companyName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                  Company Name
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  required
                  placeholder="e.g. Google, Microsoft, Amazon"
                  className="h-12 rounded-xl border-2 input-animated input-focus-glow"
                />
                <p className="text-xs text-muted-foreground ml-1">Enter the company name</p>
              </div>
              
              <div className="space-y-2.5 group">
                <Label htmlFor="role" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                  Job Role
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="role"
                  name="role"
                  required
                  placeholder="e.g. Software Engineer, Product Manager"
                  className="h-12 rounded-xl border-2 input-animated input-focus-glow"
                />
                <p className="text-xs text-muted-foreground ml-1">Position you're applying for</p>
              </div>
              
              <div className="space-y-2.5 group">
                <Label htmlFor="location" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. San Francisco, Remote, Hybrid"
                  className="h-12 rounded-xl border-2 input-animated input-focus-glow"
                />
                <p className="text-xs text-muted-foreground ml-1">Job location or work type</p>
              </div>
              
              <div className="space-y-2.5 group">
                <Label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                  Status
                  <span className="text-destructive">*</span>
                </Label>
                <Select name="status" defaultValue={ApplicationStatus.APPLIED}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.values(ApplicationStatus).map(status => (
                      <SelectItem key={status} value={status} className="rounded-lg">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground ml-1">Current application status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Information Section */}
        <Card className="overflow-hidden animate-fade-in-up stagger-2 card-hover">
          <CardHeader className="gradient-bg-subtle border-b border-border/50 p-5 px-6">
            <CardTitle className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
              <FileText className="h-4 w-4 text-rose-500" />
              Resume Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2.5 group">
              <Label htmlFor="resumeName" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                Resume Version Name
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="resumeName"
                name="resumeName"
                required
                placeholder="e.g. SDE_Resume_v2, Frontend_React_2024"
                className="h-12 rounded-xl border-2 input-animated input-focus-glow"
              />
              <p className="text-xs text-muted-foreground ml-1 flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                Use descriptive names to track which resume version you used
              </p>
            </div>

            <div className="space-y-2.5">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Attach Resume (PDF)
              </Label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="resume-file"
              />
              <label
                htmlFor="resume-file"
                className={`
                  flex items-center justify-center gap-4 w-full px-6 py-10 rounded-2xl border-2 border-dashed 
                  cursor-pointer transition-all duration-300 ease-out group/upload
                  ${fileData 
                    ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500/70' 
                    : 'border-border/60 hover:border-primary/50 hover:gradient-bg-subtle bg-muted/30'
                  }
                `}
              >
                {fileData ? (
                  <div className="flex items-center gap-4 w-full animate-scale-in">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">File Ready!</p>
                      <p className="text-xs text-muted-foreground truncate">{fileData.name}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">Click to change file</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.preventDefault(); clearFile(); }}
                      className="text-muted-foreground hover:text-destructive transition-colors duration-200 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-16 h-16 gradient-bg-subtle rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover/upload:bg-gradient-to-br group-hover/upload:from-orange-500 group-hover/upload:to-amber-500 group-hover/upload:scale-110">
                      <Upload className="h-8 w-8 text-primary transition-colors duration-300 group-hover/upload:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground mb-1">Upload Resume PDF</p>
                      <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
                    </div>
                  </div>
                )}
              </label>
              <p className="text-xs text-muted-foreground ml-1">
                Attach the resume you used for this application (optional)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="overflow-hidden animate-fade-in-up stagger-3 card-hover">
          <CardHeader className="gradient-bg-subtle border-b border-border/50 p-5 px-6">
            <CardTitle className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
              <Briefcase className="h-4 w-4 text-blue-500" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2.5 group">
              <Label htmlFor="jobDescription" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ml-1 transition-colors duration-200 group-focus-within:text-primary">
                Job Description / Notes
              </Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                rows={6}
                placeholder="Paste job requirements, add notes about the application, interview dates, or any relevant information..."
                className="rounded-xl p-4 resize-none min-h-[160px] border-2 input-focus-glow transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Add any relevant information about this application
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-in-up stagger-4">
          <Button 
            type="submit" 
            variant="gradient"
            size="xl"
            className="flex-1 gap-2 group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving Application...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                Save Application
              </>
            )}
          </Button>
          <Link href="/applications" className="flex-shrink-0">
            <Button 
              type="button" 
              variant="outline" 
              size="xl" 
              className="w-full sm:w-auto px-8 transition-colors duration-300 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
        </div>

        {/* Sidebar Analytics */}
        {applications.length > 0 && (
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden animate-fade-in-up stagger-6 card-hover sticky top-6">
              <CardHeader className="gradient-bg-subtle border-b border-border/50 p-5">
                <CardTitle className="text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
                        <p className="text-lg font-bold text-foreground">{applications.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interviews</p>
                        <p className="text-lg font-bold text-blue-500">{stats.interviews}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Offers</p>
                        <p className="text-lg font-bold text-emerald-500">{stats.offers}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Response Rate</p>
                        <p className="text-lg font-bold text-purple-500">{responseRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href="/applications">
                  <Button variant="outline" className="w-full gap-2 group">
                    View All Applications
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <Card className="overflow-hidden animate-fade-in-up stagger-5 border-dashed bg-muted/30">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl gradient-bg-subtle flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1.5">Pro Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Use descriptive resume names like "Frontend_React_2024" to easily identify which resume you used for each application</li>
              <li>Add job descriptions to help you prepare for interviews and compare opportunities</li>
              <li>Update the status regularly to keep track of your application progress</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
