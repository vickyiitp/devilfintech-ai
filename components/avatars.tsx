// components/avatars.tsx
import React from 'react';

type AvatarProps = React.SVGProps<SVGSVGElement>;

const BoyAvatar1: React.FC<AvatarProps> = (props) => (
  <svg viewBox="0 0 128 128" {...props}>
    <path fill="#FFDDC3" d="M123 103c0-29-23-53-52-53S19 74 19 103" />
    <path fill="#2C2C2C" d="M91 63c0-14-11-25-25-25s-25 11-25 25h50z" />
    <circle fill="#FFFFFF" cx="51" cy="79" r="6" />
    <circle fill="#FFFFFF" cx="83" cy="79" r="6" />
    <path fill="#333" d="M62 93c0 1-1 2-2 2h-4c-1 0-2-1-2-2 0-2 2-4 4-4s4 2 4 4z" />
  </svg>
);

const BoyAvatar2: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#E0A382" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#5A3A22" d="M96 50c0-17-14-31-31-31S34 33 34 50v13h62V50z"/>
        <circle fill="#FFFFFF" cx="53" cy="79" r="7"/>
        <circle fill="#FFFFFF" cx="81" cy="79" r="7"/>
        <path fill="#000000" d="M53 79a2 2 0 11-4 0 2 2 0 014 0zM81 79a2 2 0 11-4 0 2 2 0 014 0z"/>
        <path fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" d="M61 93h12"/>
    </svg>
);

const BoyAvatar3: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#F2C8AD" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#A96434" d="M84 27c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zM91 48H43c-6 0-11 5-11 11v1h70v-1c0-6-5-11-11-11z"/>
        <rect x="52" y="73" width="28" height="6" rx="3" fill="#FFFFFF"/>
        <path fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" d="M59 93q5-5 14 0"/>
    </svg>
);

const BoyAvatar4: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#FFC9A3" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#4A312A" d="M94 58c0-16-13-29-29-29S36 42 36 58h58z"/>
        <path fill="#D8A583" d="M48 76h36v6H48z"/>
        <path fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" d="M72 93a8 8 0 00-12 0"/>
    </svg>
);

const BoyAvatar5: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#E6AF8E" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#D67D3B" d="M93 35c0-16-13-28-29-28S35 19 35 35v18h58V35z"/>
        <path fill="#FFFFFF" d="M51 75h10v10H51zM71 75h10v10H71z"/>
        <path fill="#000000" d="M54 78h4v4h-4zM74 78h4v4h-4z"/>
        <rect x="58" y="93" width="16" height="4" rx="2" fill="#000000"/>
    </svg>
);

const GirlAvatar1: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#FFD4B8" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#8D5524" d="M106 58c0-23-18-42-41-42S24 35 24 58v39h82V58z"/>
        <circle fill="#FFFFFF" cx="53" cy="79" r="6"/>
        <circle fill="#FFFFFF" cx="81" cy="79" r="6"/>
        <path fill="#000000" d="M53 79a2 2 0 11-4 0 2 2 0 014 0zM81 79a2 2 0 11-4 0 2 2 0 014 0z"/>
        <path fill="#E94B4B" d="M70 91a6 6 0 11-12 0 6 6 0 0112 0z"/>
    </svg>
);

const GirlAvatar2: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#F5CBA7" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#272224" d="M99 35c0-19-15-34-34-34S31 16 31 35v58h68V35z"/>
        <path fill="#C1E1DC" d="M47 50h38v4H47z"/>
        <path fill="#000000" d="M56 79a3 3 0 11-6 0 3 3 0 016 0zM84 79a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" d="M64 93q-4 4-8 0"/>
    </svg>
);

const GirlAvatar3: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#FFDBAC" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#E8A651" d="M101 45c0-20-16-36-36-36S29 25 29 45v21h72V45z"/>
        <path fill="#4CAF50" d="M36 60h60v6H36z"/>
        <path fill="none" stroke="#000000" strokeWidth="3" d="M52 79l8 8 8-8m-16-8l8 8 8-8"/>
        <path fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" d="M70 95a8 8 0 00-12 0"/>
    </svg>
);

const GirlAvatar4: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#D29988" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#4B3A33" d="M103 62c0-21-17-38-38-38S27 41 27 62v31h76V62z"/>
        <path fill="#B26553" d="M37 62h58v8H37z"/>
        <circle fill="#FFFFFF" cx="54" cy="79" r="5"/>
        <circle fill="#FFFFFF" cx="78" cy="79" r="5"/>
        <path fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" d="M64 94c-3 0-5-2-5-4s2-4 5-4 5 2 5 4-2 4-5 4z"/>
    </svg>
);

const GirlAvatar5: React.FC<AvatarProps> = (props) => (
    <svg viewBox="0 0 128 128" {...props}>
        <path fill="#DEA784" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
        <path fill="#C75B41" d="M89 27c0 14-11 25-25 25S39 41 39 27 50 2 64 2s25 11 25 25zM104 53c0-5-4-9-9-9H37c-5 0-9 4-9 9v13h85V53z"/>
        <circle fill="#000000" cx="55" cy="79" r="4"/>
        <circle fill="#000000" cx="77" cy="79" r="4"/>
        <path fill="#000000" d="M60 92h12v4H60z"/>
    </svg>
);


export const avatars: Record<string, React.FC<AvatarProps>> = {
    boy1: BoyAvatar1,
    boy2: BoyAvatar2,
    boy3: BoyAvatar3,
    boy4: BoyAvatar4,
    boy5: BoyAvatar5,
    girl1: GirlAvatar1,
    girl2: GirlAvatar2,
    girl3: GirlAvatar3,
    girl4: GirlAvatar4,
    girl5: GirlAvatar5,
};

interface UserAvatarProps extends AvatarProps {
    avatarId: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ avatarId, ...props }) => {
    const AvatarComponent = avatars[avatarId];
    if (!AvatarComponent) {
        // Fallback generic avatar
        return (
            <svg viewBox="0 0 128 128" {...props}>
                <path fill="#BDBDBD" d="M123 103c0-29-23-53-52-53S19 74 19 103"/>
                <circle fill="#F5F5F5" cx="67" cy="50" r="31"/>
            </svg>
        );
    }
    return <AvatarComponent {...props} />;
};
