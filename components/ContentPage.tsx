import React, { useState } from 'react';
import { Box, Button, Group, Text, ActionIcon, FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo'; // Corrected import for MantineLogo
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
        <Group className={classes.topOptions} style={{ justifyContent: 'center' }}>
          <Button variant="subtle" className={classes.topButton} style={{ marginRight: '1rem' }}>
            How It Works
          </Button>
          <Button variant="subtle" className={classes.topButton}>
            Donate
          </Button>
        </Group>

        {!selectedFile ? (
          <Box className={classes.centerContent}>
            <Text className={classes.mainTitle}>Audio Cutter</Text>
            <Text className={classes.subtitle}>
              Free editor to trim and cut any audio file online
            </Text>

            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <IconUpload size="1.2rem" style={{ marginRight: '0.5rem' }} />
              <FileInput
                placeholder="Browse my files"
                accept="audio/*"
                onChange={handleFileChange}
              />
            </Box>
          </Box>
        ) : (
          <AudioEditor audioFile={selectedFile} opened={opened} toggleNavbar={toggleNavbar} />
        )}

        {!selectedFile && (
          <Box className={classes.infoSection}>
            <Text className={classes.infoTitle}>How to cut audio</Text>
            <Box className={classes.infoBox}>
              <Text className={classes.infoText}>
                This app can be used to trim and/or cut audio tracks, remove audio fragments. Fade in and fade out your music easily to make the audio harmoniously.
              </Text>
              <Text className={classes.infoText} mt="md">
                It is fast and easy to use. You can save the audio file in any format (codec parameters are configured).
              </Text>
              <Text className={classes.infoText} mt="md">
                It works directly in the browser, no need to install any software, and is available for mobile devices.
              </Text>
            </Box>

            <Text className={classes.infoTitle} mt="xl">Privacy and security guaranteed</Text>
            <Box className={classes.infoBox}>
              <Text className={classes.infoText}>
                This is a serverless app; your files do not leave your device.
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ContentPage;
