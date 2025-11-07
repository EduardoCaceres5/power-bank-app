import { Box, Image, ImageProps } from '@chakra-ui/react';

interface LogoProps extends Omit<ImageProps, 'src' | 'alt'> {
  variant?: 'full' | 'icon';
}

export const Logo = ({ variant = 'full', ...props }: LogoProps) => {
  return (
    <Box display="inline-block">
      <Image
        src="/logo.png"
        alt="Power Bank Logo"
        height={variant === 'full' ? '40px' : '32px'}
        width="auto"
        objectFit="contain"
        {...props}
      />
    </Box>
  );
};
