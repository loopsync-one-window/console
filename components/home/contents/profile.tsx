'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { getProfileMe, getCachedProfile, changePassword } from '@/lib/api'

export function Profile() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<{
    fullName: string;
    email: string;
    memberSince: string;
    termsAccepted: boolean;
    activePlan: string;
  }>({
    fullName: 'N/A',
    email: 'N/A',
    memberSince: new Date().toISOString(),
    termsAccepted: false,
    activePlan: 'N/A',
  });
  const [userPlan, setUserPlan] = useState('PRO');
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const planFromStorage = localStorage.getItem('user_plan') || 'PRO';
    setUserPlan(planFromStorage);
    (async () => {
      try {
        const cached = getCachedProfile();
        if (cached) {
          setProfile(cached);
          setUserPlan(cached.activePlan || planFromStorage);
        } else {
          const data = await getProfileMe();
          setProfile(data);
          setUserPlan(data.activePlan || planFromStorage);
        }
      } catch (e) {
        // Keep fallback values if API fails
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-4 md:px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">My Profile</p>
      </div>

      <div className="px-4 md:px-8 xl:px-12 mt-4 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 2px)',
            }}
          />
          <div className="relative p-6 md:p-12 flex flex-col md:flex-row items-center gap-6">
            <img src="/resources/apple.svg" alt="Apple" className="w-10 h-10 brightness-0 invert" />
            <img src="/resources/windows.svg" alt="Windows" className="w-9 h-9 brightness-0 invert" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Account Snapshot</h2>
              <p className="mt-1 text-white/70">View your profile details and manage your account.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 xl:px-12 pb-20">
        <Card className="bg-black/40 border-white/5 rounded-3xl shadow-xl hover:border-white/5 transition-colors">
          <CardHeader>
            <CardTitle className="text-white">Profile Details</CardTitle>
            <CardDescription className="text-white/70">Key account information and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/30 to-white/10 border border-white/20 ring-2 ring-white/20 shadow-lg flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {profile.fullName?.charAt(0)?.toUpperCase() || 'R'}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" />
                    </svg>
                    Full Name
                  </div>
                  <div className="text-white font-semibold uppercase">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-32 h-5" /> : profile.fullName}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7h18v10H3z" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                    Email
                  </div>
                  <div className="text-white font-semibold">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-40 h-5" /> : profile.email}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                    Member Since
                  </div>
                  <div className="text-white font-semibold">{isLoading ? <span className="inline-block bg-white/5 animate-pulse rounded-full w-24 h-5" /> : new Date(profile.memberSince).toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Terms Accepted
                  </div>
                  <div className="text-white font-semibold">
                    {isLoading ? (
                      <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-5" />
                    ) : (
                      <span className={profile.termsAccepted ? 'inline-flex items-center rounded-full bg-green-900/90 px-3 py-1 text-xs font-bold text-white' : 'inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white'}>
                        {profile.termsAccepted ? 'Yes' : 'No'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                    </svg>
                    Active Plan
                  </div>
                  <div className="text-white font-semibold">
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-white to-white/70 px-3 py-1 text-xs font-bold text-black shadow">
                      {isLoading ? <span className="inline-block bg-black/10 animate-pulse rounded-full w-16 h-5" /> : userPlan?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="pt-6 flex gap-3">
                  <Button className="rounded-full bg-white text-black font-semibold hover:bg-white/90 disabled:bg-white/5 disabled:text-white/50" disabled>Edit Profile</Button>
                  <Button variant="outline" className="rounded-full bg-white text-black font-semibold hover:bg-white/90 hover:text-black cursor-pointer" onClick={() => setIsPasswordOpen(true)}>Change Password</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isPasswordOpen} onOpenChange={(open) => {
        setIsPasswordOpen(open);
        if (!open) {
          setNewPassword('');
          setConfirmPassword('');
        }
      }}>
        <DialogContent className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
            <DialogDescription className="text-white/80">Enter your new password and confirm to update.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white/80">New Password</Label>
              <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white/80">Confirm Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Re-enter new password" />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="rounded-full bg-white text-black font-semibold hover:bg-white/90"
              onClick={async () => {
                if (!newPassword || !confirmPassword) {
                  // toast({ title: 'Missing fields', description: 'Enter and confirm your new password.', variant: 'destructive' });
                  return;
                }
                if (newPassword !== confirmPassword) {
                  // toast({ title: 'Passwords do not match', description: 'Ensure both passwords are identical.', variant: 'destructive' });
                  return;
                }
                setIsChanging(true);
                try {
                  const res = await changePassword(newPassword, confirmPassword);
                  // toast({ title: 'Success', description: res.message || 'Password changed successfully.' });
                  setIsPasswordOpen(false);
                  setNewPassword('');
                  setConfirmPassword('');
                } catch (e) {
                  // toast({ title: 'Change failed', description: 'Please try again later.', variant: 'destructive' });
                } finally {
                  setIsChanging(false);
                }
              }}
              disabled={isChanging}
            >
              {isChanging ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Profile;
