import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import { MantineTransition, DefaultProps } from '@mantine/core';
import { useActionsState } from './use-actions-state/use-actions-state';
import { useSpotlightShortcuts } from './use-spotlight-shortcuts/use-spotlight-shortcuts';
import { Spotlight, SpotlightStylesNames } from './Spotlight/Spotlight';
import type { SpotlightAction } from './types';
import { SpotlightContext } from './Spotlight.context';

export interface SpotlightProviderProps
  extends DefaultProps<SpotlightStylesNames>,
    React.ComponentPropsWithoutRef<'div'> {
  actions: SpotlightAction[];
  children: React.ReactNode;
  onSpotlightOpen?(): void;
  onSpotlightClose?(): void;
  shortcut?: string | string[];
  withinPortal?: boolean;
  transition?: MantineTransition;
  transitionDuration?: number;
}

export function SpotlightProvider({
  actions: initialActions,
  children,
  shortcut = 'mod + K',
  withinPortal = true,
  transition = 'pop',
  transitionDuration = 150,
  onSpotlightClose,
  onSpotlightOpen,
  ...others
}: SpotlightProviderProps) {
  const [actions, { registerActions, removeActions, triggerAction }] =
    useActionsState(initialActions);

  const [opened, { open, close, toggle }] = useDisclosure(true, {
    onClose: onSpotlightClose,
    onOpen: onSpotlightOpen,
  });

  useSpotlightShortcuts(shortcut, toggle);

  return (
    <SpotlightContext.Provider
      value={{
        openSpotlight: open,
        closeSpotlight: close,
        toggleSpotlight: toggle,
        registerActions,
        removeActions,
        triggerAction,
        opened,
        actions,
      }}
    >
      <Spotlight
        actions={actions}
        onClose={close}
        opened={opened}
        withinPortal={withinPortal}
        transition={transition}
        transitionDuration={transitionDuration}
        {...others}
      />
      {children}
    </SpotlightContext.Provider>
  );
}

SpotlightProvider.displayName = '@mantine/spotlight/SpotlightProvider';
