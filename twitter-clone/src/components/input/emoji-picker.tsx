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
    const viewportHeight = window.innerHeight;
    const pickerHeight = 400; // Height of emoji picker
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    // If there's not enough space below, show above
    if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
      setPosition('top');
    } else {
      setPosition('bottom');
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
            className={`absolute right-0 z-50 ${
              position === 'top' 
                ? 'bottom-full mb-2' 
                : 'top-full mt-2'
            }`}
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