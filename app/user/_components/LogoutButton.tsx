"use client";

import { usePlayer } from "@/context/PlayerContext";
import { handleLogout } from "@/lib/actions/auth-action";

interface LogoutButtonProps {
  isMobile?: boolean;
}

export default function LogoutButton({ isMobile = false }: LogoutButtonProps) {
  const { stopPlayer } = usePlayer();

  const handleLogoutClick = async () => {
    // Stop the player first
    stopPlayer();
    
    // Then logout
    await handleLogout();
  };

  return (
    <button
      onClick={handleLogoutClick}
      className={`${isMobile ? 'flex-1' : ''} h-9 px-3 inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/15 text-sm font-medium hover:bg-foreground/5 transition-colors`}
    >
      Logout
    </button>
  );
}
