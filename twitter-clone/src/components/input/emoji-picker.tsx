import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { ToolTip } from '@components/ui/tooltip';
import { useTheme } from '@lib/context/theme-context';

type EmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
  modal?: boolean;
};

export function EmojiPickerComponent({ onEmojiSelect, modal }: EmojiPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const pickerHeight = 400; // Height of emoji picker
    
    if (modal) {
      // In modal context, find the modal container
      const modalContainer = buttonRef.current.closest('[role="dialog"]') || 
                           buttonRef.current.closest('.modal') ||
                           buttonRef.current.closest('[data-modal]');
      
      if (modalContainer) {
        const modalRect = modalContainer.getBoundingClientRect();
        const spaceBelow = modalRect.bottom - buttonRect.bottom;
        const spaceAbove = buttonRect.top - modalRect.top;
        
        // Prefer showing above in modals to avoid overflow
        if (spaceAbove > pickerHeight || spaceAbove > spaceBelow) {
          setPosition('top');
        } else {
          setPosition('bottom');
        }
      } else {
        // Fallback: default to top for modals
        setPosition('top');
      }
    } else {
      // Regular viewport calculation
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
        setPosition('top');
      } else {
        setPosition('bottom');
      }
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  const togglePicker = () => {
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Theme-specific styles for the emoji picker
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          backgroundColor: '#15202b',
          color: '#ffffff',
          borderColor: '#38444d'
        };
      case 'dim':
        return {
          backgroundColor: '#192734',
          color: '#ffffff',
          borderColor: '#38444d'
        };
      default: // light
        return {
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#e1e8ed'
        };
    }
  };

  const themeStyles = getThemeStyles();

  // For modals, we need to render the picker with a higher z-index and better positioning
  const getPickerPositionClass = () => {
    if (modal) {
      return `fixed ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`;
    }
    return `absolute right-0 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}`;
  };

  const getPickerStyle = () => {
    if (!modal || !buttonRef.current) return {};
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const pickerWidth = 350;
    
    // Calculate left position to keep picker in view
    const leftPosition = Math.min(
      buttonRect.left,
      window.innerWidth - pickerWidth - 16 // 16px margin from edge
    );
    
    return {
      position: 'fixed' as const,
      left: `${leftPosition}px`,
      [position === 'top' ? 'bottom' : 'top']: position === 'top' 
        ? `${window.innerHeight - buttonRect.top + 8}px`
        : `${buttonRect.bottom + 8}px`,
      zIndex: 9999,
      right: 'auto'
    };
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        ref={buttonRef}
        className="accent-tab accent-bg-tab group relative rounded-full p-2 
                   hover:bg-main-accent/10 active:bg-main-accent/20"
        onClick={togglePicker}
      >
        <HeroIcon className="h-5 w-5" iconName="FaceSmileIcon" />
        <ToolTip tip="Emoji" modal={modal} />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className={`z-50 ${getPickerPositionClass()}`}
            style={getPickerStyle()}
          >
            <div 
              className="rounded-lg shadow-xl border"
              style={{
                backgroundColor: themeStyles.backgroundColor,
                borderColor: themeStyles.borderColor,
                color: themeStyles.color
              }}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={350}
                height={400}
                searchDisabled={false}
                skinTonesDisabled={true}
                lazyLoadEmojis={true}
                previewConfig={{
                  showPreview: false
                }}
                theme={theme === 'light' ? Theme.LIGHT : Theme.DARK}
                searchPlaceholder="Search emoji..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 