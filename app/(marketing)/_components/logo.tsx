import Image from 'next/image';
import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';

const font = Poppins({
    subsets: ['latin'],
    weight: ["400", "600"],
});

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image className='dark:hidden' src='/logo.svg' width="40" height="40" alt='Jotion Logo' />
            <Image className='hidden dark:block' src='/logo-dark.svg' width="40" height="40" alt='Jotion Logo' />
            <p className={cn("font-semibold", font.className)}>Jotion</p>
        </div>
    )
}