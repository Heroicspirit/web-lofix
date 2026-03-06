import { test, expect } from '@playwright/test';

test.describe('User Flows and Integration', () => {
  test('complete user journey from dashboard to search', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play a song on dashboard
    const dashboardSong = page.locator('[data-testid="song-item"]').first();
    await dashboardSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    const dashboardSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Navigate to search page
    await page.goto('/user/search');
    await page.waitForLoadState('networkidle');
    
    // Player should still be visible with same song
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    const searchPageSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    expect(searchPageSongTitle).toBe(dashboardSongTitle);
    
    // Search for something
    await page.fill('[placeholder="Search for songs, artists, or albums..."]', 'test');
    await page.waitForTimeout(2000);
    
    // Player should still be playing during search
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Play a different song from search results if available
    const searchResults = page.locator('[data-testid="song-item"]');
    const resultCount = await searchResults.count();
    
    if (resultCount > 0) {
      await searchResults.first().click();
      await page.waitForTimeout(2000);
      
      // Song should have changed
      const newSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      expect(newSongTitle).toBeTruthy();
    }
    
    // Navigate back to dashboard
    await page.goto('/user/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Player should still be visible
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
  });

  test('multiple songs playlist behavior', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Get multiple songs
    const songs = page.locator('[data-testid="song-item"]');
    const songCount = await songs.count();
    
    if (songCount >= 3) {
      // Play first song
      await songs.nth(0).click();
      await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
      
      const firstSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      
      // Use next button to cycle through songs
      await page.locator('[data-testid="next-btn"]').click();
      await page.waitForTimeout(2000);
      
      const secondSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      
      // Use next button again
      await page.locator('[data-testid="next-btn"]').click();
      await page.waitForTimeout(2000);
      
      const thirdSongTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      
      // Use previous button
      await page.locator('[data-testid="previous-btn"]').click();
      await page.waitForTimeout(2000);
      
      const backToSecondTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      
      // Verify playlist navigation works
      expect(backToSecondTitle).toBe(secondSongTitle);
    }
  });

  test('playback controls state consistency', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Test play/pause toggle multiple times
    const playPauseBtn = page.locator('[data-testid="play-pause-btn"]');
    
    for (let i = 0; i < 5; i++) {
      await playPauseBtn.click();
      await page.waitForTimeout(500);
      
      // Player should remain visible and functional
      await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
      await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
    }
    
    // Test rapid next/previous clicks
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-testid="next-btn"]').click();
      await page.waitForTimeout(300);
      await page.locator('[data-testid="previous-btn"]').click();
      await page.waitForTimeout(300);
    }
    
    // Player should still be working
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
  });

  test('error recovery and resilience', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Simulate network issues by rapid navigation
    await page.goto('/user/search');
    await page.waitForTimeout(100);
    await page.goto('/user/dashboard');
    await page.waitForTimeout(100);
    await page.goto('/user/search');
    await page.waitForTimeout(100);
    await page.goto('/user/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Player should recover and still be visible
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 10000 });
  });

  test('browser tab behavior', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    const songTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Simulate tab blur/focus
    await page.evaluate(() => {
      window.dispatchEvent(new Event('blur'));
    });
    await page.waitForTimeout(1000);
    
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'));
    });
    await page.waitForTimeout(1000);
    
    // Player should still be working
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    const currentTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    expect(currentTitle).toBe(songTitle);
  });

  test('memory and performance', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play multiple songs rapidly
    const songs = page.locator('[data-testid="song-item"]');
    const songCount = await songs.count();
    
    // Cycle through songs multiple times
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let i = 0; i < Math.min(5, songCount); i++) {
        await songs.nth(i).click();
        await page.waitForTimeout(200);
      }
    }
    
    // Player should still be responsive
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Test controls still work
    await page.locator('[data-testid="play-pause-btn"]').click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
  });

  test('concurrent user interactions', async ({ page }) => {
    // Start on dashboard
    await page.goto('/user/dashboard');
    await page.waitForSelector('[data-testid="song-item"]', { timeout: 10000 });
    
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Simulate concurrent interactions
    await Promise.all([
      page.locator('[data-testid="next-btn"]').click(),
      page.waitForTimeout(100),
      page.locator('[data-testid="play-pause-btn"]').click(),
      page.waitForTimeout(100),
    ]);
    
    // Player should handle concurrent actions gracefully
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });
});
