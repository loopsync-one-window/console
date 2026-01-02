'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

import { updateNotificationsPreference, updateMusicExperiencePreference, updateEmergencyLockdownPreference, getProfilePreferences, getCachedProfilePreferences, requestDeletionOtp, confirmDeletion, logoutAny } from '@/lib/api'

export function Settings() {
  const [notifications, setNotifications] = useState(false);
  const [musicExperience, setMusicExperience] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [loadingLockdown, setLoadingLockdown] = useState(false);
  const [loadingInit, setLoadingInit] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [requestOtpLoading, setRequestOtpLoading] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [showExitOverlay, setShowExitOverlay] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const cached = getCachedProfilePreferences();
        if (cached) {
          setNotifications(cached.notifications === 'active');
          setMusicExperience(cached.musicExperience === 'active');
          setAutoSave(cached.emergencyLockdown === 'active');
        } else {
          const prefs = await getProfilePreferences();
          setNotifications(prefs.notifications === 'active');
          setMusicExperience(prefs.musicExperience === 'active');
          setAutoSave(prefs.emergencyLockdown === 'active');
        }
      } catch (e) {
        // toast({ title: 'Failed to load preferences', description: 'Using defaults.', variant: 'destructive' });
      } finally {
        setLoadingInit(false);
      }
    })();
  }, [toast]);

  const handleConfirmDelete = async () => {
    if (!/^\d{6}$/.test(otp)) {
      // toast({ title: 'Invalid OTP', description: 'Enter the 6-digit code to proceed.', variant: 'destructive' });
      return;
    }
    setConfirmDeleteLoading(true);
    try {
      const res = await confirmDeletion(otp);
      setIsOtpOpen(false);
      // toast({ title: 'Success', description: res.message || 'Your account is scheduled for deletion.' });

      // Clear all tokens from localStorage
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('user');
      } catch (e) {
        console.error('Error clearing localStorage:', e);
      }

      // Logout from API
      try {
        await logoutAny();
      } catch (e) {
        console.error('Error logging out from API:', e);
      }

      setShowExitOverlay(true);
      setTimeout(() => {
        window.location.href = 'https://loopsync.cloud';
      }, 3000);
    } catch (e) {
      // toast({ title: 'Deletion failed', description: 'Please try again later.', variant: 'destructive' });
    } finally {
      setConfirmDeleteLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background relative overflow-auto scrollbar-hide">
      <div className="px-4 md:px-8 xl:px-12 pt-10 pb-4">
        <p className="text-4xl font-semibold text-white">Settings</p>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white">Preference Snapshot</h2>
              <p className="mt-1 text-white/70">Adjust preferences and account security settings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 xl:px-12 pb-20">
        <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-white">Preferences</h2>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-10 gap-4">
                  <div>
                    <p className="font-bold text-white">Notifications</p>
                    <p className="text-sm text-white/70">Receive notifications about your account activity</p>
                  </div>
                  {loadingInit ? (
                    <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-6" />
                  ) : (
                    <Switch
                      checked={notifications}
                      disabled={loadingNotifications || loadingInit}
                      onCheckedChange={async (checked) => {
                        const prev = notifications;
                        setNotifications(checked);
                        setLoadingNotifications(true);
                        try {
                          await updateNotificationsPreference(checked);
                          // toast({ title: 'Updated', description: 'Notifications preference saved.' });
                        } catch (e) {
                          setNotifications(prev);
                          // toast({ title: 'Failed', description: 'Could not update notifications.', variant: 'destructive' });
                        } finally {
                          setLoadingNotifications(false);
                        }
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">Music Experience</p>
                    <p className="text-sm text-white/70">Enable music experience to listen to music while using the platform</p>
                  </div>
                  {loadingInit ? (
                    <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-6" />
                  ) : (
                    <Switch
                      checked={musicExperience}
                      disabled={loadingMusic || loadingInit}
                      onCheckedChange={async (checked) => {
                        const prev = musicExperience;
                        setMusicExperience(checked);
                        setLoadingMusic(true);
                        try {
                          await updateMusicExperiencePreference(checked);
                          // toast({ title: 'Updated', description: 'Music experience preference saved.' });
                        } catch (e) {
                          setMusicExperience(prev);
                          // toast({ title: 'Failed', description: 'Could not update music experience.', variant: 'destructive' });
                        } finally {
                          setLoadingMusic(false);
                        }
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">Emergency Lockdown</p>
                    <p className="text-sm text-white/70">Lockdown your account in case of unauthorized access</p>
                  </div>
                  {loadingInit ? (
                    <span className="inline-block bg-white/5 animate-pulse rounded-full w-12 h-6" />
                  ) : (
                    <Switch
                      checked={autoSave}
                      disabled={loadingLockdown || loadingInit}
                      onCheckedChange={async (checked) => {
                        const prev = autoSave;
                        setAutoSave(checked);
                        setLoadingLockdown(true);
                        try {
                          await updateEmergencyLockdownPreference(checked);
                          // toast({ title: 'Updated', description: 'Emergency lockdown preference saved.' });
                        } catch (e) {
                          setAutoSave(prev);
                          // toast({ title: 'Failed', description: 'Could not update emergency lockdown.', variant: 'destructive' });
                        } finally {
                          setLoadingLockdown(false);
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* <div>
              <h2 className="text-lg font-semibold mb-4 text-white">Account</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Change Password</p>
                    <p className="text-sm text-white/70">Update your password</p>
                  </div>
                  <Button variant="outline" className="rounded-full text-white">Change</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-white/70">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" className="rounded-full text-white">Enable</Button>
                </div>
              </div>
            </div> */}

            <div className="pt-4 border-t border-border mt-4 ">
              <Button
                className='bg-red-700 hover:bg-red-600 rounded-full cursor-pointer text-white font-bold'
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              This action will permanently delete your account. All associated data and your current plan will be lost and cannot be recovered.            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='text-white rounded-full'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setRequestOtpLoading(true);
                setIsDeleteOpen(false);
                setIsOtpOpen(true);
                try {
                  const res = await requestDeletionOtp();
                  if (res.success) {
                    // toast({ title: 'OTP sent', description: res.message });
                  } else {
                    // toast({ title: 'Failed to send OTP', description: res.message, variant: 'destructive' });
                  }
                } catch (e) {
                  // toast({ title: 'Failed to send OTP', description: 'Please try again later.', variant: 'destructive' });
                } finally {
                  setRequestOtpLoading(false);
                }
              }}
              className="bg-red-700 hover:bg-red-600 rounded-full cursor-pointer text-white font-bold"
            >
              {requestOtpLoading ? 'Sending...' : 'Okay'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Enter 6-digit OTP</DialogTitle>
            <DialogDescription className="text-white/80">Enter the code sent to your email to confirm deletion.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-2">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOtpOpen(false)} className="rounded-full">Cancel</Button>
            <Button className="bg-red-700 hover:bg-red-600 text-white font-semibold rounded-full cursor-pointer" onClick={handleConfirmDelete} disabled={confirmDeleteLoading}>
              {confirmDeleteLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {showExitOverlay && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/60 border-t-transparent rounded-full animate-spin" />
            <div className="text-white font-semibold">Processing account deletion...</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
