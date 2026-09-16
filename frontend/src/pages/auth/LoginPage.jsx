import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiQuillPenLine, RiSparklingLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import { loginSchema } from '../../lib/schemas';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-surface)]">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[var(--color-surface-1)] border-r border-[var(--color-border)] flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[var(--color-accent)]/25">
            <RiQuillPenLine className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">Your creative AI workspace</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">Generate stories, poems, scripts, and video prompts with the power of AI.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            {['Stories & Poems', 'Video Scripts', 'AI Video Prompts', 'Character Creator'].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded-[var(--radius-md)] px-3 py-2 border border-[var(--color-border)]">
                <RiSparklingLine className="text-[var(--color-accent)] shrink-0 text-sm" />
                <span className="text-xs text-[var(--color-text-secondary)]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <RiQuillPenLine className="text-white text-sm" />
            </div>
            <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">Muse</span>
          </div>

          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">Sign in to continue creating</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            </div>
            <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-2">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-[var(--color-text-secondary)] text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[var(--color-accent)] hover:underline font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
