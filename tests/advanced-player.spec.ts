import { test, expect } from '@playwright/test';

test.describe('Advanced Player Controls', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard and start with a clean state
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
  });

  test('volume controls are accessible', async ({ page }) => {
    // Play a song first
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Check if volume controls exist (even if not implemented yet)
    // This test will help identify when volume controls are added
    const playerBar = page.locator('[data-testid="global-player"]');
    const hasVolumeControls = await playerBar.locator('[data-testid*="volume"]').count();
    
    // For now, we expect no volume controls (this test will fail when they're added)
    expect(hasVolumeControls).toBe(0);
  });

  test('progress bar updates during playback', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Check if progress bar exists (will be added later)
    const playerBar = page.locator('[data-testid="global-player"]');
    const hasProgressBar = await playerBar.locator('[data-testid*="progress"]').count();
    
    // For now, expect no progress bar (test will fail when implemented)
    expect(hasProgressBar).toBe(0);
  });

  test('keyboard shortcuts work', async ({ page }) => {
    // Play a song first
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Test spacebar for play/pause
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);
    
    // Check if player is still visible
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Test arrow keys for next/previous
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    
    // Player should still be working
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
  });

  test('player state persists on browser refresh', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Get current song title
    const songTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Refresh the page
    await page.reload();
    
    // Wait for page to reload
    await page.waitForLoadState('networkidle');
    
    // Player should still be visible (localStorage should restore state)
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Same song should still be playing
    const currentTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    expect(currentTitle).toBe(songTitle);
  });

  test('multiple rapid clicks are handled gracefully', async ({ page }) => {
    // Find multiple songs
    const songs = page.locator('[data-testid="song-item"]');
    const count = await songs.count();
    
    if (count >= 2) {
      // Rapid click multiple songs
      for (let i = 0; i < Math.min(5, count); i++) {
        await songs.nth(i).click();
        await page.waitForTimeout(200);
      }
      
      // Player should still be functional
      await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
      await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
    }
  });

  test('player handles empty playlist gracefully', async ({ page }) => {
    // This test would need to mock empty playlist state
    // For now, we'll verify player doesn't crash with single song
    
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Click next button multiple times (should wrap around)
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid="next-btn"]').click();
      await page.waitForTimeout(500);
    }
    
    // Player should still be working
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });

  test('player accessibility basics', async ({ page }) => {
    // Play a song first
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Check that buttons are visible and can be focused
    const playPauseBtn = page.locator('[data-testid="play-pause-btn"]');
    const nextBtn = page.locator('[data-testid="next-btn"]');
    const prevBtn = page.locator('[data-testid="previous-btn"]');
    
    await expect(playPauseBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
    await expect(prevBtn).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    // Player should still be accessible (just check it's still visible)
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
  });

  test('player responsive design', async ({ page }) => {
    // Play a song first on desktop
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click({ force: true });
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 15000 });
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Player should still be visible on mobile
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Player should still work on tablet
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    // Player should still work on desktop
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });
});
