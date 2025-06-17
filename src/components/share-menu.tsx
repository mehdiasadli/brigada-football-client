import { ActionIcon, Menu, type ActionIconProps } from '@mantine/core';
import { IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconCopy, IconShare } from '@tabler/icons-react';
import { useState } from 'react';
import { handleCopy, handleShare } from '../utils/share';

interface ShareMenuProps {
  label: string;
  copyLink: string;
  copyMessage?: string;
  sharePath: string;
  shareText?: string;
  targetProps?: ActionIconProps;
}

export default function ShareMenu({
  label,
  copyLink,
  copyMessage = 'Link copied to clipboard',
  sharePath,
  shareText = 'Check out this resource in Brigada Football',
  targetProps,
}: ShareMenuProps) {
  const [isShareHovered, setIsShareHovered] = useState(false);

  const { style: targetStyleProps, ...restTargetProps } = targetProps ?? {};

  return (
    <Menu shadow='lg' width={220} position='top-end' withArrow>
      <Menu.Target>
        <ActionIcon
          size='lg'
          radius='xl'
          variant='subtle'
          color='green'
          onMouseEnter={() => setIsShareHovered(true)}
          onMouseLeave={() => setIsShareHovered(false)}
          style={{
            transform: isShareHovered ? 'scale(1.1) rotate(15deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            background: isShareHovered ? 'var(--mantine-color-green-0)' : 'transparent',
            ...targetStyleProps,
          }}
          {...restTargetProps}
        >
          <IconShare
            size={18}
            style={{
              transform: isShareHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          background: 'linear-gradient(135deg, white 0%, var(--mantine-color-gray-0) 100%)',
          border: '1px solid var(--mantine-color-gray-2)',
        }}
      >
        <Menu.Label>{label}</Menu.Label>

        <Menu.Item
          leftSection={<IconCopy size={16} />}
          onClick={() =>
            handleCopy(copyLink, {
              message: copyMessage,
            })
          }
        >
          Copy link
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconBrandTwitter size={16} color='var(--mantine-color-blue-6)' />}
          onClick={() =>
            handleShare('twitter', {
              path: sharePath,
              text: shareText,
            })
          }
        >
          Share on Twitter
        </Menu.Item>

        <Menu.Item
          leftSection={<IconBrandFacebook size={16} color='var(--mantine-color-blue-7)' />}
          onClick={() =>
            handleShare('facebook', {
              path: sharePath,
              text: shareText,
            })
          }
        >
          Share on Facebook
        </Menu.Item>

        <Menu.Item
          leftSection={<IconBrandWhatsapp size={16} color='var(--mantine-color-teal-6)' />}
          onClick={() =>
            handleShare('whatsapp', {
              path: sharePath,
              text: shareText,
            })
          }
        >
          Share on WhatsApp
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
