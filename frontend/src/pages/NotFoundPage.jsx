import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiQuillPenLine, RiArrowLeftLine } from 'react-icons/ri';
import Button from '../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-6">
          <RiQuillPenLine className="text-[var(--color-text-muted)] text-2xl" />
        </div>
        <p className="text-8xl font-bold text-[var(--color-surface-3)] mb-4 select-none tracking-tight">404</p>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Page not found</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="secondary">
            <RiArrowLeftLine />
            Back to dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;
