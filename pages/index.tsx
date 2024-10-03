import { useState } from 'react';
import { AppShell } from '@mantine/core';
import { NavbarMinimal } from '../components/NavbarMinimal';
import { ContentPage } from '../components/ContentPage';

export default function HomePage() {
  const [opened, setOpened] = useState(true);

  const toggleNavbar = () => setOpened((o) => !o);

  return (
    <AppShell
      navbar={{ width: 80, breakpoint: 'sm', collapsed: { desktop: !opened, mobile: !opened } }}
      padding={0}
    >
      <AppShell.Navbar>
        <NavbarMinimal opened={opened} toggleNavbar={toggleNavbar} />
      </AppShell.Navbar>
      <AppShell.Main>
        <ContentPage opened={opened} toggleNavbar={toggleNavbar} />
      </AppShell.Main>
    </AppShell>
  );
}
