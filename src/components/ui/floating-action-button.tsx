import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  isActive = false,
  className
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        isActive && "bg-primary-glow scale-110",
        className
      )}
      size="sm"
    >
      {icon}
    </Button>
  );
};