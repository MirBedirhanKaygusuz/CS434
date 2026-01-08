/**
 * ThemeManager - Singleton Pattern
 *
 * Ensures only one instance of theme manager exists throughout the application.
 * Manages theme state (light/dark) and persists it to localStorage.
 */

export type Theme = 'light' | 'dark'

class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: Theme
  private listeners: Set<(theme: Theme) => void>

  /**
   * Private constructor - prevents direct instantiation
   * Can only be called internally by getInstance()
   */
  private constructor() {
    this.listeners = new Set()

    // Load theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme')
    this.currentTheme = (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'

    // Apply theme to document on initialization
    this.applyTheme()
  }

  /**
   * Get the single instance of ThemeManager (Singleton pattern)
   * Creates instance on first call, returns existing instance on subsequent calls
   */
  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  /**
   * Get current theme
   */
  public getTheme(): Theme {
    return this.currentTheme
  }

  /**
   * Set theme and persist to localStorage
   */
  public setTheme(theme: Theme): void {
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    this.applyTheme()
    this.notifyListeners()
  }

  /**
   * Toggle between light and dark theme
   */
  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }

  /**
   * Subscribe to theme changes
   * Returns unsubscribe function
   */
  public subscribe(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.currentTheme)
  }

  /**
   * Notify all subscribers of theme change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme))
  }
}

// Export getInstance as default export for convenience
export default ThemeManager
