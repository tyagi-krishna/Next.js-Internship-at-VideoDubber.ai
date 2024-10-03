import { useState } from 'react';
import { Center, UnstyledButton, Stack, rem, Text } from '@mantine/core';
import {
  IconSeparator,
  IconWaveSquare,
  IconMicrophone,
  IconKey,
  IconHeartbeat,
  IconCut,
  IconLink,
  IconRecordMail,
  IconMicrophone2,
  IconLifebuoy,
  IconFlag,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
  icon: React.FC<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
      <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      <Text size="xs" mt={4} ta="center">{label}</Text>
    </UnstyledButton>
  );
}

const mockdata = [
  { icon: IconSeparator, label: 'Remover' },
  { icon: IconWaveSquare, label: 'Splitter' },
  { icon: IconMicrophone, label: 'Pitcher' },
  { icon: IconKey, label: 'Key' },
  { icon: IconHeartbeat, label: 'BPM Finder' },
  { icon: IconCut, label: 'Cutter' },
  { icon: IconLink, label: 'Joiner' },
  { icon: IconRecordMail, label: 'Recorder' },
  { icon: IconMicrophone2, label: 'Karaoke' },
];

interface NavbarMinimalProps {
  opened: boolean;
  toggleNavbar: () => void;
}

export function NavbarMinimal({ opened, toggleNavbar }: NavbarMinimalProps) {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <>
      <Center className={classes.logoWrapper} onClick={toggleNavbar}>
        <MantineLogo type="mark" size={30} />
      </Center>
      <nav className={`${classes.navbar} ${opened ? '' : classes.navbarClosed}`}>
        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0} className={classes.footer}>
          <NavbarLink icon={IconLifebuoy} label="Support" />
          <NavbarLink icon={IconFlag} label="India" />
        </Stack>
      </nav>
    </>
  );
}

export default NavbarMinimal;
