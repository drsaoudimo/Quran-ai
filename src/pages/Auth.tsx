import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Book } from 'lucide-react';
import { toast } from 'sonner';

export function Auth() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn();
      navigate('/');
    } catch (error: any) {
      toast.error('خطأ', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background islamic-pattern p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-primary/10">
            <Book className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-cairo text-xl font-bold">تسجيل الدخول</h2>
          <p className="font-cairo text-sm text-muted-foreground">
            سجل دخولك لحفظ تقدمك وعلاماتك المرجعية
          </p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full font-cairo"
        >
          {loading ? 'جارٍ التسجيل...' : 'تسجيل الدخول باستخدام Google'}
        </Button>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-muted-foreground hover:text-foreground font-cairo"
          >
            متابعة بدون حساب
          </button>
        </div>
      </div>
    </div>
  );
}
