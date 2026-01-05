export interface EditorResponse {
  content: string
  success: boolean
  wordCount: number
  charCount: number
}

export type TextFormat = 'bold' | 'italic' | 'underline'

export interface SelectionRange {
  start: number
  end: number
}
