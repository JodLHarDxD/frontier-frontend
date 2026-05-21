import { MotionStack } from '../components/MotionStack';
import { GalleryStrip } from '../components/GalleryStrip';

export const Motion = () => {
  return (
    <main className="w-full min-h-screen bg-bg-primary text-text-primary">
      <MotionStack />
      <GalleryStrip />
    </main>
  );
};
