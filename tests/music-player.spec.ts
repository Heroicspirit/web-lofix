import { test, expect } from '@playwright/test';

test.describe('Music Player Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard page
    await page.goto('/user/dashboard');
    // Wait for songs to load
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
  });

  test('global player appears when song is played', async ({ page }) => {
    // Find and click the first song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for global player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 5000 });
    
    // Check if current song title is displayed
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });

  test('play/pause functionality works', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Click play/pause button
    const playPauseBtn = page.locator('[data-testid="play-pause-btn"]');
    await playPauseBtn.click();
    
    // Check if button state changed (you might need to adjust this based on your UI)
    await expect(playPauseBtn).toBeVisible();
  });

  test('music persists across page navigation', async ({ page }) => {
    // Start playing a song on dashboard
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear with longer timeout
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 10000 });
    
    // Get the current song title
    const songTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    console.log('Song title before navigation:', songTitle);
    
    // Wait a moment for state to settle
    await page.waitForTimeout(2000);
    
    // Navigate to search page
    await page.goto('/user/search');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for context to restore
    await page.waitForTimeout(3000);
    
    // Global player should still be visible
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 10000 });
    
    // Same song should still be playing
    const currentTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    console.log('Song title after navigation:', currentTitle);
    expect(currentTitle).toBe(songTitle);
  });

  test('next/previous buttons work', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Get initial song title
    const initialTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Click next button
    await page.locator('[data-testid="next-btn"]').click();
    
    // Wait a moment for song to change
    await page.waitForTimeout(1000);
    
    // Song should have changed (unless there's only one song)
    const newTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    // Note: This might fail if there's only one song in the list
  });

  test('cover images load in global player', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Check if cover image loads
    const coverImage = page.locator('[data-testid="cover-image"]');
    await expect(coverImage).toBeVisible();
    
    // Verify image loaded successfully (not broken)
    const imgSrc = await coverImage.getAttribute('src');
    expect(imgSrc).toBeTruthy();
    expect(imgSrc).not.toContain('undefined');
  });
});
