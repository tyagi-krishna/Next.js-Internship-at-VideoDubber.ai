import React, { useState } from 'react';
import { Box, Title, Text, Button, Group, FileInput, ActionIcon } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './ContentPage.module.css';
import AudioEditor from './AudioEditor';

interface ContentPageProps {
  opened: boolean;
  toggleNavbar: () => void;
}

export function ContentPage({ opened, toggleNavbar }: ContentPageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  return (
    <Box className={classes.container}>
      {!opened && !selectedFile && (
        <ActionIcon
          className={classes.menuButton}
          onClick={toggleNavbar}
          size="lg"
          variant="filled"
          color="blue"
          radius="xl"
        >
          <MantineLogo type="mark" size={24} />
        </ActionIcon>
      )}
      <Box className={classes.content}>
        <Group className={classes.topOptions} position="center" spacing="xl">
          <Button variant="subtle" className={classes.topButton}>How It Works</Button>
          <Button variant="subtle" className={classes.topButton}>Donate</Button>
        </Group>

        {!selectedFile ? (
          <Box className={classes.centerContent}>
            <Title order={1} className={classes.mainTitle}>Audio Cutter</Title>
            <Text className={classes.subtitle}>
              Free editor to trim and cut any audio file online
            </Text>

            <FileInput
              placeholder="Browse my files"
              icon={<IconUpload size="1.2rem" />}
              accept="audio/*"
              onChange={handleFileChange}
            />
          </Box>
        ) : (
          <AudioEditor audioFile={selectedFile} opened={opened} toggleNavbar={toggleNavbar} />
        )}

        {!selectedFile && (
          <Box className={classes.infoSection}>
            <Title order={2} className={classes.infoTitle}>How to cut audio</Title>
            <Box className={classes.infoBox}>
              <Text className={classes.infoText}>
                This app can be used to trim and/or cut audio tracks, remove an audio fragments. Fade in and fade out your music easily to make the audio harmoniously.
              </Text>
              <Text className={classes.infoText} mt="md">
                It fast and easy to use. You can save the audio file in any format (codec parameters are configured)
              </Text>
              <Text className={classes.infoText} mt="md">
                It works directly in the browser, no needs to install any software, is available for mobile devices.
              </Text>
            </Box>

            <Title order={2} className={classes.infoTitle} mt="xl">Privacy and security guaranteed</Title>
            <Box className={classes.infoBox}>
              <Text className={classes.infoText}>
                This is serverless app, your files doesn't leave your device
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ContentPage;
