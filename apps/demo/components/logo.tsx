import Image from 'next/image';

export default function Logo() {
    return (
        <div style={{ color: 'var(--color-accent-500)' }}>
            <Image src="/images/logo-full.svg" alt="Logo" width={96} height={26} />
        </div>
    )
}