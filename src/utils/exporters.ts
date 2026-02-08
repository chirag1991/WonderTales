import jsPDF from 'jspdf'
import type { Story } from '../types/story'

const sanitizeFileName = (value: string) =>
  value.replace(/[^a-z0-9\- ]/gi, '').trim() || 'wondertales-story'

export const exportStoryToPdf = (story: Story) => {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 48
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2

  doc.setFont('Times', 'Bold')
  doc.setFontSize(20)
  doc.text(story.title, margin, margin)

  doc.setFont('Times', 'Normal')
  doc.setFontSize(12)
  const lines = doc.splitTextToSize(story.content, maxWidth)
  doc.text(lines, margin, margin + 36)

  doc.save(`${sanitizeFileName(story.title)}.pdf`)
}
