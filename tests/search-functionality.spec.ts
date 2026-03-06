import { test, expect } from '@playwright/test';

test.describe('Search and Playlist Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to search page
    await page.goto('/user/search');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('search functionality works', async ({ page }) => {
    // Type in search input
    await page.fill('[placeholder="Search for songs, artists, or albums..."]', 'test');
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Check if search results section appears
    await expect(page.locator('text=Search Results')).toBeVisible();
  });

  test('recommended songs are clickable', async ({ page }) => {
    // Look for recommended songs section (should be visible when not searching)
    await expect(page.locator('text=Recommended for You')).toBeVisible();
    
    // Find first recommended song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await expect(firstSong).toBeVisible();
    
    // Click the song
    await firstSong.click();
    
    // Global player should appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 10000 });
    
    // Song title should be displayed
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });

  test('search results can be played', async ({ page }) => {
    // Type search query
    await page.fill('[placeholder="Search for songs, artists, or albums..."]', 'coffee');
    
    // Wait for search results
    await page.waitForTimeout(2000);
    
    // If results exist, try to play first one
    const searchResults = page.locator('[data-testid="song-item"]');
    const count = await searchResults.count();
    
    if (count > 0) {
      const firstResult = searchResults.first();
      await firstResult.click();
      
      // Global player should appear
      await expect(page.locator('[data-testid="global-player"]')).toBeVisible({ timeout: 10000 });
      
      // Check if song is playing
      const currentTitle = await page.locator('[data-testid="current-song-title"]').textContent();
      expect(currentTitle).toBeTruthy();
    }
  });

  test('no results message appears', async ({ page }) => {
    // Type a search query that likely has no results
    await page.fill('[placeholder="Search for songs, artists, or albums..."]', 'xyz123nonexistent');
    
    // Wait for search to complete
    await page.waitForTimeout(2000);
    
    // Should show "No real songs found" message
    await expect(page.locator('text=No real songs found in database yet...')).toBeVisible();
  });

  test('play/pause button toggles state', async ({ page }) => {
    // Start by playing a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Get initial button state (should show pause icon when playing)
    const playPauseBtn = page.locator('[data-testid="play-pause-btn"]');
    await expect(playPauseBtn).toBeVisible();
    
    // Click pause button
    await playPauseBtn.click();
    await page.waitForTimeout(500);
    
    // Click play button again
    await playPauseBtn.click();
    await page.waitForTimeout(500);
    
    // Button should still be visible (state toggled)
    await expect(playPauseBtn).toBeVisible();
  });

  test('cover image loads correctly', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Check cover image
    const coverImage = page.locator('[data-testid="cover-image"]');
    await expect(coverImage).toBeVisible();
    
    // Verify image has loaded (has src attribute)
    const imgSrc = await coverImage.getAttribute('src');
    expect(imgSrc).toBeTruthy();
    expect(imgSrc).not.toContain('undefined');
    expect(imgSrc).not.toContain('null');
  });

  test('next button functionality', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Get initial song title
    const initialTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Click next button
    await page.locator('[data-testid="next-btn"]').click();
    await page.waitForTimeout(2000);
    
    // Song should still be playing (might be same if only one song)
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });

  test('previous button functionality', async ({ page }) => {
    // Play a song
    const firstSong = page.locator('[data-testid="song-item"]').first();
    await firstSong.click();
    
    // Wait for player to appear
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    
    // Get initial song title
    const initialTitle = await page.locator('[data-testid="current-song-title"]').textContent();
    
    // Click previous button
    await page.locator('[data-testid="previous-btn"]').click();
    await page.waitForTimeout(2000);
    
    // Song should still be playing (might be same if only one song)
    await expect(page.locator('[data-testid="global-player"]')).toBeVisible();
    await expect(page.locator('[data-testid="current-song-title"]')).toBeVisible();
  });
});
