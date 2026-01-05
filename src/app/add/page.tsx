'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplications, useFileUpload } from '@/hooks';
import { Application, ApplicationStatus } from '@/types';
import { calculateStats } from '@/lib/stats';
import { dateUtils } from '@/utils/date';
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
  Lightbulb,
  Send,
  X,
  Info,
  TrendingUp,
  Target,
  Calendar,
  CalendarDays
} from 'lucide-react';
import { toast } from 'sonner';

export default function AddApplicationPage() {
  const router = useRouter();
  const { applications, addApplication } = useApplications();
  const { fileData, handleFileChange, clearFile } = useFileUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = useMemo(() => calculateStats(applications), [applications]);

  const responseRate = useMemo(() => {
    if (applications.length === 0) return 0;
    const responded = applications.filter(app =>
      app.status !== ApplicationStatus.APPLIED && app.status !== ApplicationStatus.PENDING
    ).length;
    return Math.round((responded / applications.length) * 100);
  }, [applications]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    await new Promise<void>(resolve => setTimeout(resolve, 400));

    // Get the date from form or use today's date
    const dateAppliedValue = formData.get('dateApplied') as string;
    const appliedDate = dateAppliedValue
      ? dateUtils.formatDate(dateAppliedValue)
      : dateUtils.formatDate(new Date());

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
      dateApplied: appliedDate,
    };

    addApplication(app);
    clearFile();
    toast.success('Application added successfully!', {
      description: `${app.companyName} - ${app.role}`,
    });
    router.push('/applications');
  };

  // Form component to avoid duplication
  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Company Information Section */}
      <Card className="overflow-hidden animate-fade-in-up stagger-1 border-2 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="gradient-bg-subtle border-b border-border/50 p-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 group">
              <Label htmlFor="companyName" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                Company Name
                <span className="text-destructive text-xs">*</span>
              </Label>
              <Input
                id="companyName"
                name="companyName"
                required
                placeholder="e.g. Google, Microsoft, Amazon"
                className="h-10 rounded-lg border-2 input-animated input-focus-glow"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="role" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                Job Role
                <span className="text-destructive text-xs">*</span>
              </Label>
              <Input
                id="role"
                name="role"
                required
                placeholder="e.g. Software Engineer, Product Manager"
                className="h-10 rounded-lg border-2 input-animated input-focus-glow"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="location" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. San Francisco, Remote, Hybrid"
                className="h-10 rounded-lg border-2 input-animated input-focus-glow"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="status" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                Status
                <span className="text-destructive text-xs">*</span>
              </Label>
              <Select name="status" defaultValue={ApplicationStatus.APPLIED}>
                <SelectTrigger className="h-10 rounded-lg border-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {Object.values(ApplicationStatus).map(status => (
                    <SelectItem key={status} value={status} className="rounded-md">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="dateApplied" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" />
                Date Applied
              </Label>
              <Input
                id="dateApplied"
                name="dateApplied"
                type="date"
                defaultValue={dateUtils.formatISO(new Date())}
                max={dateUtils.formatISO(new Date())}
                className="h-10 rounded-lg border-2 input-animated input-focus-glow"
              />
              <p className="text-xs text-muted-foreground">
                Select the date you applied to this position
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Information Section */}
      <Card className="overflow-hidden animate-fade-in-up stagger-2 border-2 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="gradient-bg-subtle border-b border-border/50 p-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
            <FileText className="h-3.5 w-3.5 text-rose-500" />
            Resume Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2 group">
            <Label htmlFor="resumeName" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary flex items-center gap-1.5">
              Resume Version Name
              <span className="text-destructive text-xs">*</span>
            </Label>
            <Input
              id="resumeName"
              name="resumeName"
              required
              placeholder="e.g. SDE_Resume_v2, Frontend_React_2024"
              className="h-10 rounded-lg border-2 input-animated input-focus-glow"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Info className="h-3 w-3 flex-shrink-0" />
              Use descriptive names to track which resume version you used
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
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
                flex items-center justify-center gap-3 w-full px-4 py-6 rounded-lg border-2 border-dashed 
                cursor-pointer transition-all duration-300 ease-out group/upload
                ${fileData
                  ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500/70'
                  : 'border-border/60 hover:border-primary/50 hover:gradient-bg-subtle bg-muted/30'
                }
              `}
            >
              {fileData ? (
                <div className="flex items-center gap-3 w-full animate-scale-in">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">File Ready!</p>
                    <p className="text-xs text-muted-foreground truncate">{fileData.name}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.preventDefault(); clearFile(); }}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border transition-all duration-300 ease-out group-hover/upload:bg-accent">
                    <Upload className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover/upload:text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Upload Resume PDF</p>
                    <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
                  </div>
                </div>
              )}
            </label>
            <p className="text-xs text-muted-foreground">
              Attach the resume you used for this application (optional)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card className="overflow-hidden animate-fade-in-up stagger-3 border-2 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="gradient-bg-subtle border-b border-border/50 p-4 px-5">
          <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
            <Briefcase className="h-3.5 w-3.5 text-blue-500" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-2 group">
            <Label htmlFor="jobDescription" className="text-xs font-semibold text-foreground transition-colors duration-200 group-focus-within:text-primary">
              Job Description / Notes
            </Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              rows={5}
              placeholder="Paste job requirements, add notes about the application, interview dates, or any relevant information..."
              className="rounded-lg p-3 resize-none min-h-[120px] border-2 input-focus-glow transition-all duration-300"
            />
            <p className="text-xs text-muted-foreground">
              Add any relevant information about this application
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 animate-fade-in-up stagger-4">
        <Button
          type="submit"
          variant="gradient"
          size="default"
          className="flex-1 gap-2 group h-10"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              Save Application
            </>
          )}
        </Button>
        <Link href="/applications" className="flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            size="default"
            className="w-full sm:w-auto px-6 h-10 transition-colors duration-300 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4 animate-fade-in pb-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg transition-all duration-300 hover:bg-accent hover:scale-105">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
            <FilePlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="gradient-text-primary">Add</span> Application
            </h1>
            <p className="text-muted-foreground text-xs font-medium mt-0.5">
              Track a new company you applied to
            </p>
          </div>
        </div>
      </header>

      {/* Conditional Layout: Grid with sidebar when applications exist, centered when empty */}
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-5">
            <FormContent />
          </div>

          {/* Sidebar Analytics */}
          <div className="lg:col-span-1 space-y-5">
            <Card className="overflow-hidden animate-fade-in-up stagger-6 border-2 hover:border-primary/30 transition-all duration-300 sticky top-6">
              <CardHeader className="gradient-bg-subtle border-b border-border/50 p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 m-0 leading-none">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
                        <Briefcase className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total</p>
                        <p className="text-base font-bold text-foreground">{applications.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                        <Target className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Interviews</p>
                        <p className="text-base font-bold text-blue-500">{stats.interviews}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Offers</p>
                        <p className="text-base font-bold text-emerald-500">{stats.offers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                        <Calendar className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Response Rate</p>
                        <p className="text-base font-bold text-purple-500">{responseRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/applications">
                  <Button variant="outline" size="sm" className="w-full gap-2 group h-9">
                    View All Applications
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Centered Form Layout when no applications */
        <div className="flex justify-center">
          <div className="w-full max-w-3xl space-y-5">
            <FormContent />
          </div>
        </div>
      )}

      {/* Tips Section */}
      <Card className="overflow-hidden animate-fade-in-up stagger-5 border-2 border-dashed bg-muted/30 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border border-border">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-1.5">Pro Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Use descriptive resume names like &quot;Frontend_React_2024&quot; to easily identify which resume you used for each application</li>
              <li>Add job descriptions to help you prepare for interviews and compare opportunities</li>
              <li>Update the status regularly to keep track of your application progress</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
