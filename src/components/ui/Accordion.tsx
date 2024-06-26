import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import clsx from 'clsx';
import AnimateHeight from 'react-animate-height';
import { FiChevronDown } from 'react-icons/fi';

interface ContextInterface {
  isAccordionOpen: boolean;
  setIsAccordionOpen: Dispatch<SetStateAction<boolean>>;
}

const AccordionContext = createContext<ContextInterface | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);

  if (!context) throw new Error('Error in creating the context');

  return context;
};

interface Props {
  open?: boolean;
  children: React.ReactNode;
}

export const Accordion = ({ open = false, children }: Props) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(open);

  return (
    <AccordionContext.Provider value={{ isAccordionOpen, setIsAccordionOpen }}>
      {children}
    </AccordionContext.Provider>
  );
};

const Header = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'button'>) => {
  const { isAccordionOpen, setIsAccordionOpen } = useAccordionContext();

  return (
    <button
      className={`flex w-full items-center justify-between py-4`}
      onClick={() => setIsAccordionOpen((prev) => !prev)}
      {...props}
    >
      <span>{children}</span>
      <FiChevronDown
        size="1rem"
        className={clsx('transition duration-200', {
          'rotate-180 transform': isAccordionOpen,
        })}
      />
    </button>
  );
};

const Body = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const { isAccordionOpen } = useAccordionContext();

  return (
    <AnimateHeight
      duration={200}
      height={isAccordionOpen ? 'auto' : 0}
      animateOpacity
      {...props}
    >
      {children}
    </AnimateHeight>
  );
};

Accordion.Header = Header;
Accordion.Body = Body;
